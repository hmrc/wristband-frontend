from fe import create_app
from unittest import TestCase
from mock import patch
from wb_api import WBAPIUnauthorizedError


class TestFECase(TestCase):

    @patch('fe.WBAPI')
    def setUp(self, wbapi_mock):
        self.app = create_app()
        self.app.config["API_URI"] = "dummy"
        self.app.config["SECRET_KEY"] = "dummy"
        self.client = self.app.test_client()
        self.wbapi_mock = wbapi_mock

    #  Not sure why I need to do this after it's done in setUp??
    @patch('fe.WBAPI')
    def test_post_login_stores_api_cookies_and_username_in_session(self, wbapi_mock):
        api_cookies = {"test": "cookie"}
        wbapi_mock.return_value.get_session_cookies.return_value = api_cookies
        self.client.post('/login', data=dict(username="test_user", password="test_pass"))
        with self.client.session_transaction() as sess:
            self.assertTrue(sess)
            self.assertEquals(sess["api_cookies"], api_cookies)
            self.assertEquals(sess["username"], "test_user")

    @patch('fe.WBAPI')
    def test_post_login_clears_existing_session(self, wbapi_mock):
        with self.client.session_transaction() as sess:
            sess["shouldnt_be_here"] = True
        with self.client.session_transaction() as sess:
            self.assertTrue("shouldnt_be_here" in sess)
        self.test_post_login_stores_api_cookies_and_username_in_session()
        with self.client.session_transaction() as sess:
            self.assertTrue("shouldnt_be_here" not in sess)

    def test_logout_clears_session(self):
        self.test_post_login_stores_api_cookies_and_username_in_session()
        self.client.get('/logout')
        with self.client.session_transaction() as sess:
            self.assertFalse(sess)

    def test_get_login_when_already_logged_in_redirects_to_get_apps(self):
        self.test_post_login_stores_api_cookies_and_username_in_session()
        r = self.client.get('/login')
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/")

    @patch('fe.WBAPI')
    def test_get_apps_calls_WBAPI(self, wbapi_mock):
        self.test_post_login_stores_api_cookies_and_username_in_session()
        self.client.get('/')
        wbapi_mock().get_apps.assert_called_with()

    def test_get_logout_redirects_to_login(self):
        r = self.client.get('/logout')
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/login")

    @patch('fe.WBAPI')
    def test_get_apps_not_logged_in_redirects_to_logout(self, wbapi_mock):
        wbapi_mock.return_value.get_apps.side_effect = WBAPIUnauthorizedError
        r = self.client.get('/')
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/logout")

    @patch('fe.WBAPI')
    def test_do_deployment_not_logged_in_redirects_to_logout(self, wbapi_mock):
        wbapi_mock.return_value.deploy_app.side_effect = WBAPIUnauthorizedError
        r = self.client.post('/deploy', data=dict(app="test", stage="test", version="test"))
        self.assertEquals(r.status_code, 302)
        self.assertEquals(r.location, "http://localhost/logout")

    @patch('fe.WBAPI')
    def test_get_apps_uses_etag(self, wbapi_mock):
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
        self.test_post_login_stores_api_cookies_and_username_in_session()
        self.client.post('/deploy', data=dict(app="test", stage="test", version="test"))
        print wbapi_mock.mock_calls
        wbapi_mock().deploy_app.assert_called_with("test", "test", "test")
