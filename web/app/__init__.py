import logging
import pathlib

# import the Flask class from the flask module
from flask import Flask, render_template, send_from_directory

from app.view import static_page, invite_register
from app.config import parser, settings

from app.util.config import setup_vyper
from app.util.logging import setup_logging


ROOT_PATH = pathlib.Path(__file__).resolve(strict=True).parent.parent
TEMPLATE_PATH = ROOT_PATH.joinpath('templates')
TEMPLATE_404_PATH = "404.html"

logger = logging.getLogger(__name__)


def load_static_assets(path):
    return send_from_directory(ROOT_PATH.joinpath('assets'), path)


def load_static_lib(path):
    return send_from_directory(ROOT_PATH.joinpath('node_modules'), path)


def configure(**overrides):
    logging.getLogger("vyper").setLevel(logging.WARNING)
    setup_vyper(parser, overrides)


def page_not_found(e):
    return render_template(TEMPLATE_404_PATH), 404


def create_app():
    setup_logging()

    # create the application object
    app = Flask(__name__, template_folder=str(TEMPLATE_PATH))
    app.register_error_handler(404, page_not_found)
    _setup_routes(app)

    return app


def start():
    logger.info("Environment: {}".format(settings.get("ENV_NAME")))


def _setup_routes(app):

    # Forms
    app.add_url_rule("/account", view_func=static_page)
    app.add_url_rule("/login", view_func=static_page)
    app.add_url_rule("/member/invite/register/",
                     view_func=invite_register)
    app.add_url_rule("/member/invite/register/<string:invite_key>",
                     view_func=invite_register)

    # List of static pages
    app.add_url_rule("/about-us", view_func=static_page)
    app.add_url_rule("/board-of-advisors", view_func=static_page)
    app.add_url_rule("/contact", view_func=static_page)
    app.add_url_rule("/developer", view_func=static_page)
    app.add_url_rule("/", "/index", view_func=static_page)
    app.add_url_rule("/key-demo", view_func=static_page)
    app.add_url_rule("/mail", view_func=static_page)
    app.add_url_rule("/markets", view_func=static_page)
    app.add_url_rule("/news", view_func=static_page)
    app.add_url_rule("/partners", view_func=static_page)
    app.add_url_rule("/product", view_func=static_page)
    app.add_url_rule("/sign-up", view_func=static_page)
    app.add_url_rule("/suite", view_func=static_page)
    app.add_url_rule("/team", view_func=static_page)
    app.add_url_rule("/video", view_func=static_page)


# start the server with the "run()" method
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
