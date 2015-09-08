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
            if e.response.status_code == 401:
                raise WBAPIUnauthorizedError(response=e.response)
            else:
                raise
        return r
    return wrapper


class WBAPI(object):
    def __init__(self, base_uri):
        self.__base_uri = base_uri
        self.__session = requests.Session()

    def set_session_cookies(self, cookies):
        self.__session.cookies.update(cookies)

    def get_session_cookies(self):
        return self.__session.cookies.get_dict()

    @catch_api_http_exception
    def login(self, username, password):
        session = self.__session

        r = session.post(
            urljoin(self.__base_uri, "login/"),
            {"username": username, "password": password})
        r.raise_for_status()

    @catch_api_http_exception
    def get_apps(self):
        r = self.__session.get(urljoin(self.__base_uri, "apps/"))
        r.raise_for_status()
        apps = r.json()
        return [
            dict(a.items() + {"stages": {s["name"]: s for s in a["stages"]}}.items())
            for a in apps
        ]

    @catch_api_http_exception
    def deploy_app(self, app, stage, version):
        r = self.__session.put(
            urljoin(self.__base_uri, "apps/{}/stages/{}/version/{}".format(app, stage, version)))
        r.raise_for_status()
