import gevent
from gevent.pywsgi import WSGIServer
from gevent.lock import Semaphore
from geventwebsocket.handler import WebSocketHandler
import logging
import json


logging.basicConfig(level=logging.INFO)



def process(ws,data,sem):
    logging.info('data_log {}'.format(data))
    gevent.sleep(1)
    substring = "ping"
    k = "key"
    if substring in data:
        with sem:
                ws.send('pong')
                #TODO check this part
    elif (k in data):
        with sem:
                #TODO check this part
                obj = json.loads(data)
                key = obj["key"]
                id = obj["id"]
                obj["attentionLvl"]=str(53)
                jsData = json.dumps(obj)
                ws.send(jsData)
    else:
            with sem:
                    ws.send(data)


def app(environ, start_response):
    ws = environ['wsgi.websocket']
    sem = Semaphore()
    while True:
        data = ws.receive()
        gevent.spawn(process,ws,data,sem)

server = WSGIServer(("", 5050), app,handler_class=WebSocketHandler)
logging.info('server is running on 5050 port')
server.serve_forever()
