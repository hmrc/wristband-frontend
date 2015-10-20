__all__ = [
    "WBAPIUnauthorizedError",
    "WBAPI"
]

import requests
from requests.exceptions import HTTPError as WBAPIHTTPError
from urlparse import urljoin
from functools import wraps


class WBAPIUnauthorizedError(WBAPIHTTPError):
    pass


def catch_api_http_exception(f):
    @wraps(f)
    def wrapper(*args, **kwds):
        try:
            r = f(*args, **kwds)
        except WBAPIHTTPError as e:
            if e.response.status_code in [401, 403]:
                raise WBAPIUnauthorizedError(response=e.response)
            else:
                raise
        return r
    return wrapper


class FakeResponse(object):
    content = None
    status_code = None

    def json(self):
        return self.content


class WBAPI(object):
    def __init__(self, base_uri, connect_timeout=5, read_timeout=30):
        self.__base_uri = base_uri
        self.__api_uri = urljoin(base_uri, "api/")
        self.__session = requests.Session()
        self.__timeout = (connect_timeout, read_timeout)

    def get_token(self):
        try:
            return self.__session.headers['Authorization'].split()[1]
        except KeyError:
            return None

    def set_token(self, token):
        self.__session.headers['Authorization'] = "Token {}".format(token)

    @catch_api_http_exception
    def login(self, username, password):
        session = self.__session

        r = session.post(
            urljoin(self.__base_uri, "token/"),
            {"username": username, "password": password}, timeout=self.__timeout)
        try:
            r.raise_for_status()
        except WBAPIHTTPError as e:
            try:
                assert e.response.json()["non_field_errors"][0] == "Unable to log in with provided credentials."
            except:
                raise e
            fake_response = FakeResponse()
            fake_response.content = {"details": e.response.json()["non_field_errors"][0]}
            fake_response.status_code = 401
            unauthed_exception = WBAPIUnauthorizedError(response=fake_response)
            raise unauthed_exception
        token = r.json()['token']
        self.set_token(token)

    @catch_api_http_exception
    def get_apps(self):
        r = self.__session.get(urljoin(self.__api_uri, "apps/"), timeout=self.__timeout)
        r.raise_for_status()
        apps = r.json()
        return [
            dict(a.items() + {"stages": {s["name"]: s for s in a["stages"]}}.items())
            for a in apps
        ]

    @catch_api_http_exception
    def get_stages(self):
        r = self.__session.get(urljoin(self.__api_uri, "stages/"), timeout=self.__timeout)
        r.raise_for_status()
        return r.json()

    @catch_api_http_exception
    def deploy_app(self, app, stage, version):
        r = self.__session.put(
            urljoin(self.__api_uri, "apps/{}/stages/{}/version/{}/".format(app, stage, version)),
            timeout=self.__timeout)
        r.raise_for_status()
