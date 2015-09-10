from fe import create_app
from unittest import TestCase
from mock import patch, MagicMock
from wb_api import WBAPIUnauthorizedError, WBAPIHTTPError


class TestFECase(TestCase):

    @patch('fe.WBAPI')
    def setUp(self, wbapi_mock):
        self.app = create_app('tests.config')
        self.client = self.app.test_client()
        self.wbapi_mock = wbapi_mock

    def test_healthcheck(self):
        r = self.client.get('/ping/ping')
        self.assertEquals(r.status_code, 200)

    #  Not sure why I need to do this after it's done in setUp??
    @patch('fe.WBAPI')
    def test_post_login_stores_api_cookies_and_username_in_session(self, wbapi_mock):
        """ POST /login with good user stores api_cookies in session
        """
        api_cookies = {"test": "cookie"}
        wbapi_mock.return_value.get_session_cookies.return_value = api_cookies
        self.client.post('/login', data=dict(username="test_user", password="test_pass"))
        with self.client.session_transaction() as sess:
            self.assertTrue(sess)
            self.assertEquals(sess["api_cookies"], api_cookies)
            self.assertEquals(sess["username"], "test_user")

    @patch('fe.WBAPI')
    def test_post_login_clears_existing_session(self, wbapi_mock):
        """ POST /login clears all exisiting session cookies
            This ensures that bad/expired api_cookies will be cleared
        """
        with self.client.session_transaction() as sess:
            sess["shouldnt_be_here"] = True
        with self.client.session_transaction() as sess:
            self.assertTrue("shouldnt_be_here" in sess)
        self.test_post_login_stores_api_cookies_and_username_in_session()
        with self.client.session_transaction() as sess:
            self.assertTrue("shouldnt_be_here" not in sess)

    @patch('fe.WBAPI')
    def test_post_login_with_bad_user_redirects_back_to_login(self, wbapi_mock):
        """ POST /login with bad login redirects to /login?error=bad_login, clears session cookies
        """
        bad_response_mock = MagicMock()
        bad_response_mock.json.return_value = {"details": "this is a test error"}
        wbapi_mock.return_value.login.side_effect = WBAPIUnauthorizedError(
            response=bad_response_mock)
        r = self.client.post('/login', data=dict(username="test_user", password="test_pass"))
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location,
                          "http://localhost/login?error_msg=this+is+a+test+error&error=bad_login")
        with self.client.session_transaction() as sess:
            self.assertFalse(sess)

    def test_logout_clears_session(self):
        """ GET /logout clear all session cookies
        """
        self.test_post_login_stores_api_cookies_and_username_in_session()
        self.client.get('/logout')
        with self.client.session_transaction() as sess:
            self.assertFalse(sess)

    def test_get_login_when_no_api_cookies_returns_login(self):
        """ GET /login presents login when no api_cookies are present in the session
        """
        r = self.client.get('/login')
        self.assertEquals(r.status_code, 200)

    def test_get_login_when_already_logged_in_redirects_to_get_apps(self):
        """ GET /login in when already logged in redirects to /
        """
        self.test_post_login_stores_api_cookies_and_username_in_session()
        r = self.client.get('/login')
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/")

    @patch('fe.WBAPI')
    def test_get_apps_calls_WBAPI(self, wbapi_mock):
        """ GET / results in the WBAPI class being called
        """
        self.test_post_login_stores_api_cookies_and_username_in_session()
        self.client.get('/')
        wbapi_mock().get_apps.assert_called_with()

    def test_get_logout_redirects_to_login(self):
        """ GET /logout redirects to /login
        """
        r = self.client.get('/logout')
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/login")

    @patch('fe.WBAPI')
    def test_get_apps_not_logged_in_redirects_to_logout(self, wbapi_mock):
        """ GET / when not logged in redirects to /logout
            This allows /logout to handle clearing bad session cookies and redirecting to /login
        """
        wbapi_mock.return_value.get_apps.side_effect = WBAPIUnauthorizedError
        r = self.client.get('/')
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/logout")

    @patch('fe.WBAPI')
    def test_do_deployment_not_logged_in_redirects_to_logout(self, wbapi_mock):
        """ PUT /deploy/ when not logged in redirects to /logout
            This allows /logout to handle clearing bad session cookies and redirecting to /login
        """
        wbapi_mock.return_value.deploy_app.side_effect = WBAPIUnauthorizedError
        r = self.client.post('/deploy', data=dict(app="test", stage="test", version="test"))
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/logout")

    @patch('fe.WBAPI')
    def test_get_apps_uses_etag(self, wbapi_mock):
        """ GET / return an etag and honours an If-None-Match
            This saves on sending replies if there aren't any changes
        """
        wbapi_mock.return_value.get_apps.return_value = [
            {
                "name": "app-1",
                "stages": {
                    "qa": {"name": "qa", "version": "1.9.9"},
                    "staging": {"name": "staging", "version": "1.9.7"},
                }
            }
        ]
        self.test_post_login_stores_api_cookies_and_username_in_session()
        r = self.client.get('/')
        etag, _ = r.get_etag()
        self.assertTrue(etag is not None)

        r = self.client.get('/', headers={"If-None-Match": '"{}"'.format(etag)})
        self.assertEquals(r.status_code, 304)

    @patch('fe.WBAPI')
    def test_get_apps_etag_remains_consistent_with_different_app_ordering(self, wbapi_mock):
        """ GET / returns a consistent etag in the face of changing ordering from the api
        """
        wbapi_mock.return_value.get_apps.return_value = [
            {
                "name": "app-1",
                "stages": {
                    "qa": {"name": "qa", "version": "1.9.9"},
                    "staging": {"name": "staging", "version": "1.9.7"},
                }
            },
            {
                "name": "app-2",
                "stages": {
                    "qa": {"name": "qa", "version": "1.9.9"},
                    "staging": {"name": "staging", "version": "1.9.7"},
                }
            }
        ]
        self.test_post_login_stores_api_cookies_and_username_in_session()
        r = self.client.get('/')
        etag, _ = r.get_etag()
        wbapi_mock.return_value.get_apps.return_value.reverse()
        r = self.client.get('/')
        new_etag, _ = r.get_etag()
        self.assertEquals(etag, new_etag)

    @patch('fe.WBAPI')
    def test_deploy_app_calls_WBAPI(self, wbapi_mock):
        """ POST /deploy calls WBAPI methods
        """
        self.test_post_login_stores_api_cookies_and_username_in_session()
        self.client.post('/deploy', data=dict(app="test", stage="test", version="test"))
        wbapi_mock().deploy_app.assert_called_with("test", "test", "test")

    @patch('fe.WBAPI')
    def test_WBAPIHTTPError_exception_returns_error_page_with_json_error(self, wbapi_mock):
        """ WBAPIHTTPERROR json details are passed thru to client in error page
        """
        response_mock = MagicMock()
        response_mock.status_code = 500
        response_mock.json.return_value = {"details": "An Error Message"}
        wbapi_mock.return_value.get_apps.side_effect = WBAPIHTTPError(response=response_mock)
        r = self.client.get('/')
        self.assertEquals(r.status_code, response_mock.status_code)
        self.assertTrue(response_mock.json()["details"] in r.get_data())

    @patch('fe.WBAPI')
    def test_WBAPIHTTPError_exception_returns_error_page_with_non_json_error(self, wbapi_mock):
        """ WBAPIHTTPERROR non-json details are passed thru to client in error page
        """
        response_mock = MagicMock()
        response_mock.status_code = 500
        response_mock.json.side_effect = KeyError
        response_mock.text = "An Error Message"
        wbapi_mock.return_value.get_apps.side_effect = WBAPIHTTPError(response=response_mock)
        r = self.client.get('/')
        self.assertEquals(r.status_code, response_mock.status_code)
        print r.get_data()
        self.assertTrue(response_mock.text in r.get_data())


class TestFEExceptionCase(TestCase):

    @patch('fe.views.wb_error_handler')
    @patch('fe.views.generic_error_handler')
    def setUp(self, gh_exception_mock, wb_exception_mock):
        self.app = create_app('tests.config')
        self.client = self.app.test_client()
        self.gh_exception_mock = gh_exception_mock
        self.wb_exception_mock = wb_exception_mock

    @patch('fe.WBAPI')
    def test_generic_exception_hits_catchall_exception_view(self, wbapi_mock):
        """ Generic Exception results in generic error page
        """
        e = Exception("this is an expcetion")
        wbapi_mock.return_value.get_apps.side_effect = e
        self.client.get('/')
        self.gh_exception_mock.assert_called_with(e)
        self.assertFalse(self.wb_exception_mock.called)

    @patch('fe.WBAPI')
    def test_WB_exception_hits_WB_exception_view(self, wbapi_mock):
        """ Wristband API Exception results in wristband API error page
        """
        response_mock = MagicMock()
        response_mock.status_code = 500
        response_mock.json.return_value = {"details": "An Error Message"}
        e = WBAPIHTTPError(response=response_mock)
        wbapi_mock.return_value.get_apps.side_effect = e
        self.client.get('/')
        self.wb_exception_mock.assert_called_with(e)
        self.assertFalse(self.gh_exception_mock.called)
