from wb_api import WBAPIUnauthorizedError, WBAPI
from mock import patch
from unittest import TestCase
import requests


class TestWBAPICase(TestCase):
    @patch('wb_api.requests.Session')
    def setUp(self, requests_session_mock):
        self._api_uri = "http://dummy/api/"
        self._wb = WBAPI(self._api_uri)
        self._requests_session = requests_session_mock()

    def test_bad_login_raises_exception(self):
        class BadResponse(object):
            status_code = 401

        self._requests_session.post.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=BadResponse())
        with self.assertRaises(WBAPIUnauthorizedError):
            self._wb.login("test_user", "test_password")

        self._requests_session.get.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=BadResponse())
        with self.assertRaises(WBAPIUnauthorizedError):
            self._wb.get_apps()

        self._requests_session.put.return_value.raise_for_status.side_effect = \
            requests.HTTPError(response=BadResponse())
        with self.assertRaises(WBAPIUnauthorizedError):
            self._wb.deploy_app("test-app", "test-stage", "test-version")

    def test_apps_checks_bad_status(self):
        self._wb.get_apps()
        self._requests_session.get().raise_for_status.assert_called_with()

    def test_apps_hits_api(self):
        self._wb.get_apps()
        self._requests_session.get.assert_called_with("{}apps/".format(self._api_uri))

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
            "{}apps/app-1/stages/staging/version/1.2.3".format(self._api_uri))

    def test_get_session_cookies_returns_cookies(self):
        cookies = {"cookie1": "junk"}
        self._requests_session.cookies.get_dict.return_value = cookies
        self.assertEquals(cookies, self._wb.get_session_cookies())

    def test_set_session_cookies_returns_cookies(self):
        cookies = {"cookie1": "junk"}
        self._wb.set_session_cookies(cookies)
        self._requests_session.cookies.update.assert_called_with(cookies)
