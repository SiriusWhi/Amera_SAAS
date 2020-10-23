from flask import render_template, request
from urllib.parse import urljoin
import requests
import logging
import traceback

from app.config import settings

logger = logging.getLogger(__name__)


def static_page():

    template = "{}.html".format(request.path)
    if request.path == "/":
        template = "index.html"

    try:
        client_ip = request.headers.getlist("X-Forwarded-For")[0]
    except:  # noqa: E722 - This is strictly a load balancer proxy test
        client_ip = request.remote_addr

    return render_template(template, client_ip=client_ip)


def invite_register(invite_key=None):
    template = "member/invite/register.html"

    logger.debug("Invite Key: {}".format(invite_key))

    invite_details_url = settings.get("INVITE_DETAILS_URL")
    invite_details_url = urljoin(invite_details_url, invite_key)
    invite_details_url = urljoin(request.url_root, invite_details_url)

    response = requests.get(urljoin(invite_details_url, invite_details_url))
    response_status = response.status_code

    logger.debug('Response Status: {}'.format(response_status))

    try:
        response.raise_for_status()
        invite = response.json()
    except requests.exceptions.HTTPError:

        if response_status == 404 or not invite_key:
            error = "INVITE_NOT_FOUND"
        elif response_status == 410:
            error = "INVITE_EXPIRED"
        elif response_status >= 500:
            error = "SERVER_ERROR"

        track = traceback.format_exc()
        logger.debug(track)
        logger.debug('Error Code:'.format(response_status))
        logger.debug('Invite Key:'.format(invite_key))
        return render_template(template, error=error, invite_key=invite_key)

    logger.debug("Invite Object: {}".format(invite))

    return render_template(template, invite=invite, invite_key=invite_key)
