# socketio_handler.py

from flask_socketio import emit
from flask import Flask
from app import socketio  # Import the initialized SocketIO instance from app.py


@socketio.on('disconnect')
def handle_disconnect():
    print("User disconnected")
    emit('message', {'user': 'System', 'message': 'User disconnected!'}, broadcast=True)

@socketio.on('send_message')
def handle_send_message(data):
    print(f"Message received in handle_send_message: {data}") # Check data
    try:
        emit('receive_message', data, broadcast=True)
        print("Message emitted successfully")
    except Exception as e:
        print(f"Error emitting message: {e}") #check for errors.

@socketio.on('connect')
def handle_connect():
    print("Client connected to handle_connect") #see if connect is being called
    emit('message', {'user': 'System', 'message': 'User connected!'}, broadcast=True)
