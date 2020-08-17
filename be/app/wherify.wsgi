#! /usr/bin/python3.6

import logging
import sys
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/home/alex/wherify/be/app/')
from my_flask_app import app as application
application.secret_key = 'wherify1239'