from wb_api import WBAPIUnauthorizedError, WBAPI, WBAPIHTTPError
from mock import patch
from unittest import TestCase
import requests


class TestWBAPICase(TestCase):
    @patch('wb_api.requests.Session')
    def setUp(self, requests_session_mock):
        self._api_uri = "http://dummy/"
        self._wb = WBAPI(self._api_uri)
        self._requests_session = requests_session_mock()

    def test_bad_login_raises_WBAPIUnauthorizedError_exception(self):
        class Response401(object):
            status_code = 401

        class Response403(object):
            status_code = 403

        self._requests_session.post.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=Response401())
        with self.assertRaises(WBAPIUnauthorizedError):
            self._wb.login("test_user", "test_password")

        self._requests_session.get.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=Response401())
        with self.assertRaises(WBAPIUnauthorizedError):
            self._wb.get_apps()

        self._requests_session.put.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=Response401())
        with self.assertRaises(WBAPIUnauthorizedError):
            self._wb.deploy_app("test-app", "test-stage", "test-version")

        self._requests_session.put.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=Response403())
        with self.assertRaises(WBAPIUnauthorizedError):
            self._wb.deploy_app("test-app", "test-stage", "test-version")

    def test_HTTPError_re_raises(self):
        class BadResponse(object):
            status_code = 501

        self._requests_session.post.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=BadResponse())
        with self.assertRaises(WBAPIHTTPError) as exception_context:
            self._wb.login("test_user", "test_password")
        self.assertEquals(exception_context.exception.response.status_code, 501)

        self._requests_session.get.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=BadResponse())
        with self.assertRaises(WBAPIHTTPError):
            self._wb.get_apps()
        self.assertEquals(exception_context.exception.response.status_code, 501)

        self._requests_session.put.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=BadResponse())
        with self.assertRaises(WBAPIHTTPError):
            self._wb.deploy_app("test-app", "test-stage", "test-version")
        self.assertEquals(exception_context.exception.response.status_code, 501)

    def test_apps_checks_bad_status(self):
        self._wb.get_apps()
        self._requests_session.get().raise_for_status.assert_called_with()

    def test_apps_hits_api(self):
        self._wb.get_apps()
        self._requests_session.get.assert_called_with("{}api/apps/".format(self._api_uri),
                                                      timeout=(5, 30))

    @patch('wb_api.requests.Session')
    def test_timeout_is_configurable(self, requests_session_mock):
        _wb = WBAPI(self._api_uri, connect_timeout=1, read_timeout=2)
        requests_session = requests_session_mock()
        _wb.get_apps()
        requests_session.get.assert_called_with("{}api/apps/".format(self._api_uri),
                                                timeout=(1, 2))

    def test_apps_transform(self):
        self._requests_session.get.return_value.json.return_value = [
            {
                "name": "app-1",
                "stages": [
                    {
                        "name": "qa",
                        "version": "1.9.9"
                    },
                    {
                        "name": "staging",
                        "version": "1.9.7"
                    }
                ]
            }, {
                "name": "app-2",
                "stages": [
                    {
                        "name": "qa",
                        "version": "2.3.5"
                    },
                    {
                        "name": "staging",
                        "version": "2.3.4",
                        "jobId": "1234"
                    }
                ]
            }
        ]
        apps = self._wb.get_apps()
        self.assertEquals(
            apps,
            [
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
                        "qa": {"name": "qa", "version": "2.3.5"},
                        "staging": {"name": "staging", "version": "2.3.4", "jobId": "1234"},
                    }
                }
            ])

    def test_deploy_app_checks_bad_status(self):
        self._wb.deploy_app("app-1", "staging", "1.2.3")
        self._requests_session.put().raise_for_status.assert_called_with()

    def test_deploy_app_hits_api(self):
        self._wb.deploy_app("app-1", "staging", "1.2.3")
        self._requests_session.put.assert_called_with(
            "{}api/apps/app-1/stages/staging/version/1.2.3/".format(self._api_uri),
            timeout=(5, 30))

    def test_get_token_returns_token(self):
        token = "thing"
        headers = {"Authorization": "Token {}".format(token)}
        self._requests_session.headers = headers
        self.assertEquals(token, self._wb.get_token())

    def test_set_token_sends_token_header(self):
        token = "thing"
        self._wb.set_token(token)
        print self._requests_session.headers.mock_calls
        self._requests_session.headers.__setitem__.assert_called_with(
            'Authorization', "Token {}".format(token))
