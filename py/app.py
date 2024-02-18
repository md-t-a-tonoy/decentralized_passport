import json
import os
import secrets
import uuid
import random
import string
import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import jsonify
from dotenv import load_dotenv
from flask import Flask, redirect, render_template, request, session, url_for, make_response
from flask_cors import CORS
from web3 import Account, HTTPProvider, Web3
# from web3.middleware import geth_poa_middleware

load_dotenv('.env')

# Load environment variables
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
RPC_URL = os.getenv('RPC_URL')
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')

# Initialize web3
w3 = Web3(HTTPProvider(os.environ.get('RPC_URL')))
print('Web3 Connected:', w3.isConnected())
if not w3.isConnected():
    raise ValueError("Web3 is not connected to the Ethereum node.")

# account setup
private_key= os.environ.get('PRIVATE_KEY') #private key of the account
public_key = Account.from_key(private_key)
account_address = public_key.address

# Contract instance
contract_artifacts_file = json.load(open('./contracts/gov.json'))
abi = contract_artifacts_file['abi']
contract_address = os.environ.get('CONTRACT_ADDRESS')
gov_contract = w3.eth.contract(abi=abi, address=contract_address)


secret_key = secrets.token_hex(16)
app = Flask(__name__)
app.secret_key = secret_key

CORS(app)

class TransactionReceipt:
    def __init__(self, receipt):
        self.status = receipt['status']
        self.transactionHash = receipt['transactionHash']
        self.blockHash = receipt['blockHash']
        self.blockNumber = receipt['blockNumber']
        self.from_address = receipt['from']
        self.to_address = receipt['to']
        self.gasUsed = receipt['gasUsed']
        self.logs = receipt['logs']
        # Add other necessary fields

# Or use a dictionary
def format_receipt(receipt):
    return {
        'status': receipt['status'],
        'transactionHash': receipt['transactionHash'],
        'blockHash': receipt['blockHash'],
        'blockNumber': receipt['blockNumber'],
        'from_address': receipt['from'],
        'to_address': receipt['to'],
        'gasUsed': receipt['gasUsed'],
        'logs': receipt['logs'],
        # Add other necessary fields
    }

# Function to generate a random username
def generate_username():
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(8))

# Function to send the generated username to the user's email
def send_username_via_email(receiver_email, username):
    smtp_server = 'smtp.gmail.com'  # Gmail SMTP server address
    port = 587  # Gmail SMTP port
    sender_email = 'ridamsinha20@gmail.com'  # Your Gmail address
    password = 'husky.1971'  # App password generated for Gmail

    # Create a message
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = 'Your Username for Subcontract'

    # Add body to email
    body = f'Your username for the subcontract is: {username}'
    message.attach(MIMEText(body, 'plain'))

    # Connect to the SMTP server and send the email
    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/deploy_sub_contract', methods=['POST'])
def deploy_sub_contract():
    password = request.form['password']
    uuid = request.form['uuid']
    username = generate_username()
    print('Generated username:', username)
    
    
    tx = gov_contract.functions.deploySubContract(password, uuid, username).buildTransaction({
        'from': account_address,  # Set the sender address
        'nonce': w3.eth.getTransactionCount(account_address),  # Get the nonce for the account
        'gas': 2000000,  # Set the gas limit for the transaction
        'gasPrice': w3.eth.gasPrice  # Set the gas price for the transaction
    })
    
    # tx_hash = gov_contract.functions.deploySubContract(password, uuid).transact()
        # Sign the transaction with the private key
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)

    # Send the transaction
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    
    tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    return str(tx_receipt)


@app.route('/get_sub_contract_details', methods=['POST'])
def get_sub_contract_details():
    uuid = request.form['uuid']
    contract_address = gov_contract.functions.getSubContractDetails(uuid).call()
    return contract_address

@app.route('/deploy_visa_contract', methods=['POST'])
def deploy_visa_contract():
    visa_authority = request.form['password']
    uuid = request.form['uuid']
    
    tx = gov_contract.functions.deployVisaContract(visa_authority,uuid).buildTransaction({
        'from': account_address,  # Set the sender address
        'nonce': w3.eth.getTransactionCount(account_address),  # Get the nonce for the account
        'gas': 2000000,  # Set the gas limit for the transaction
        'gasPrice': w3.eth.gasPrice  # Set the gas price for the transaction
    })
    
    # tx_hash = gov_contract.functions.deploySubContract(password, uuid).transact()
        # Sign the transaction with the private key
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    # After initializing the Web3 instance
    # w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    # tx_hash = gov_contract.functions.deployVisaContract(visa_authority, uuid).transact()
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    # tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    formatted_receipt = TransactionReceipt(receipt)  # Or format_receipt(receipt)
    return str(formatted_receipt)

@app.context_processor
def utility_processor():
    def custom_zip(*args, **kwargs):
        return zip(*args, **kwargs)
    return dict(zip=custom_zip)

@app.route('/deploy_border_authority_contract', methods=['POST'])
def deploy_border_authoritycontract():
    transport_name = request.form['transport_name']
    uuid = request.form['uuid']
    # id = request.form['id']
    tx = gov_contract.functions.deployBorderAuthorityContract(transport_name, uuid).buildTransaction({
        'from': account_address,  # Set the sender address
        'nonce': w3.eth.getTransactionCount(account_address),  # Get the nonce for the account
        'gas': 2000000,  # Set the gas limit for the transaction
        'gasPrice': w3.eth.gasPrice  # Set the gas price for the transaction
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    # After initializing the Web3 instance
    # w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    # tx_hash = gov_contract.functions.deployVisaContract(visa_authority, uuid).transact()
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    # tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    formatted_receipt = TransactionReceipt(receipt)  # Or format_receipt(receipt)
    return str(formatted_receipt)

@app.route('/get_visa', methods=['POST'])
def get_visa():
    uuid = request.form['uuid']
    visa_address = gov_contract.functions.getVisa(uuid).call()
    return visa_address

@app.route('/get_border_authority', methods=['POST'])
def get_border_authority():
    uuid = request.form['uuid']
    border_authority_address = gov_contract.functions.getBorderAuthority(uuid).call()
    return jsonify(border_authority_address)

@app.route('/get_borderauthority', methods=['POST'])
def get_borderauthority():
    data = request.get_json()
    uuid = data.get('_email')
    border_authority_address = gov_contract.functions.getBorderAuthority(uuid).call()
    return str(border_authority_address)

# Define the route to handle form submission from frontend
@app.route('/submit_form', methods=['POST'])
def submit_form():
    # Extract form data from the request
    data = request.get_json()
    password = data.get('_password')
    email = data.get('_email')
    # id = data.get('_id')
    

    # Call the deploy_border_authority_contract function
    formatted_receipt = deploy_border_authority_contract( password,email)
    
    # Return the formatted receipt to the frontend
    return jsonify(formatted_receipt)

# Define the deploy_border_authority_contract function
def deploy_border_authority_contract(password,email):
    tx = gov_contract.functions.deployBorderAuthorityContract(password,email).buildTransaction({
        'from': account_address,
        'nonce': w3.eth.getTransactionCount(account_address),
        'gas': 2000000,
        'gasPrice': w3.eth.gasPrice
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    formatted_receipt = TransactionReceipt(receipt)  # Format the receipt
    return str(formatted_receipt)

# @app.route('/get_border_authority', methods=['POST'])
# def get_border_authority():
#     data = request.get_json()  # Get JSON data from the request
#     uuid = data.get('uuid')  # Extract UUID from the JSON data
#     if uuid:
#         border_authority_address = gov_contract.functions.getBorderAuthority(uuid).call()
#         return jsonify({'border_authority_address': border_authority_address})
#     else:
#         return jsonify({'error': 'UUID not provided'})




# def set_border_status(address, status, note):
#     contract_artifacts_file = json.load(open('./contracts/BorderAuthority.json'))
#     border_authority_abi = contract_artifacts_file['abi']
#     # Use Web3 to interact with the gov contract and get the BorderAuthority address
#     border_authority_address = address
#     border_authority_contract = w3.eth.contract(address=border_authority_address, abi=border_authority_abi)
#     # Use Web3 to send a transaction to the setBorderStatus function
#     tx = border_authority_contract.functions.setBorderStatus(address, status, note).buildTransaction({
#         'from': account_address,
#         'nonce': w3.eth.getTransactionCount(account_address),
#         # Additional transaction parameters (gas, gasPrice, etc.)
#     })
#     signed_tx = w3.eth.account.sign_transaction(tx, private_key)
#     tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
#     receipt = w3.eth.waitForTransactionReceipt(tx_hash)
#     return receipt

# def get_all_statuses_and_notes(address):
#     contract_artifacts_file = json.load(open('./contracts/BorderAuthority.json'))
#     border_authority_abi = contract_artifacts_file['abi']
#     # Use Web3 to interact with the gov contract and get the BorderAuthority address
#     border_authority_address = address
#     border_authority_contract = w3.eth.contract(address=border_authority_address, abi=border_authority_abi)
#     # Assuming you have the contract instance `border_authority_contract` with the correct ABI and address
#     # Use Web3 to call the getAllStatusesAndNotes function
#     all_statuses_and_notes = border_authority_contract.functions.getAllStatusesAndNotes().call()
#     return all_statuses_and_notes


# def login_to_border_authority(uuid, transport_name):
#     contract_artifacts_file = json.load(open('./contracts/BorderAuthority.json'))
#     border_authority_abi = contract_artifacts_file['abi']
#     border_authority_address = gov_contract.functions.getBorderAuthority(uuid).call()
#     border_authority_contract = w3.eth.contract(address=border_authority_address, abi=border_authority_abi)
#     return border_authority_contract.functions.login(transport_name, uuid).call()

def login_to_border_authority( transport_name, uuid):
    contract_artifacts_file = json.load(open('./contracts/BorderAuthority.json'))
    border_authority_abi = contract_artifacts_file['abi']
    # Use Web3 to interact with the gov contract and get the BorderAuthority address
    border_authority_address = gov_contract.functions.getBorderAuthority(uuid).call()
    border_authority_contract = w3.eth.contract(address=border_authority_address, abi=border_authority_abi)
    
    # Call the login function of the BorderAuthority contract
    return border_authority_contract.functions.login(transport_name, uuid).call()

def set_border_status(uuid_from_form, uuid_from_cookie, status, note):
    contract_artifacts_file = json.load(open('./contracts/BorderAuthority.json'))
    border_authority_abi = contract_artifacts_file['abi']
    user_contract_address = gov_contract.functions.getSubContractDetails(uuid_from_form).call()
    border_authority_address = gov_contract.functions.getBorderAuthority(uuid_from_cookie).call()
    print("user_contract_address: ",user_contract_address)
    print("border_authority_address: ",border_authority_address)
    border_authority_contract = w3.eth.contract(address=border_authority_address, abi=border_authority_abi)
    tx = border_authority_contract.functions.setBorderStatus(user_contract_address, status, note).buildTransaction({
        'from': account_address,
        'nonce': w3.eth.getTransactionCount(account_address),
        'gas': 2000000,
        'gasPrice': w3.eth.gasPrice
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    receipt = w3.eth.waitForTransactionReceipt(tx_hash)
    return receipt

def get_all_statuses_and_notes(uuid_from_form, uuid_from_cookie):
    contract_artifacts_file = json.load(open('./contracts/BorderAuthority.json'))
    border_authority_abi = contract_artifacts_file['abi']
    usercontract_address = gov_contract.functions.getSubContractDetails(uuid_from_form).call()
    border_authority_address = gov_contract.functions.getBorderAuthority(uuid_from_cookie).call()
    border_authority_contract = w3.eth.contract(address=border_authority_address, abi=border_authority_abi)
    all_statuses_and_notes = border_authority_contract.functions.getStatusesAndNotes(usercontract_address).call()
    
    return all_statuses_and_notes

# Function to set cookies with statuses and notes
def set_status_cookie(statuses, notes):
    response = make_response(redirect(url_for('status_page')))
    response.set_cookie('statuses', ','.join(statuses), domain='localhost')
    response.set_cookie('notes', ','.join(notes), domain='localhost')
    return response

# Function to retrieve statuses and notes from cookies
def get_status_cookie():
    statuses = request.cookies.get('statuses')
    notes = request.cookies.get('notes')
    return statuses.split(','), notes.split(',') if statuses and notes else [], []

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         uuid = request.form['uuid']
#         transport_name = request.form['transport_name']
#         if login_to_border_authority(uuid, transport_name):
#             session['uuid'] = uuid
#             return redirect(url_for('status_page'))
#         else:
#             # Redirect to an error page with a message if login fails
#             return render_template('error.html', message="Login failed. Please check your credentials.")
#     return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        transport_name = data.get('_password')
        _uuid = data.get('_uuid')
        # id = data.get('_id')

        if login_to_border_authority(transport_name, _uuid):
            # Generate a UUID
            uuid_value = str(uuid.uuid4())
            # Combine the secret key and UUID
            session_uuid = secret_key + uuid_value
            session['uuid'] = _uuid
             # Construct the full URL for the status page including the port
            status_page_url = 'http://localhost:5000' + url_for('status_page')
            # Return a JSON response with the full redirect URL
            return jsonify({'status': True, 'redirect_url': status_page_url, 'uuid': _uuid})
        else:
            return jsonify({'status': False, 'message': 'Login failed. Please check your credentials.'})
            # Redirect to an error page with a message if login fails
            # return render_template('error.html', message="Login failed. Please check your credentials.")
    # return render_template('login.html')


@app.route('/status', methods=['GET', 'POST'])
def status_page():
    if request.method == 'POST':
        uuid_from_cookie = request.cookies.get('uuid')
        uuid_from_form = request.form['uuid']
        status = request.form['status']
        note = request.form['note']
        receipt = set_border_status(uuid_from_form, uuid_from_cookie, status, note)
        
        response = set_status_cookie([status], [note])
        return response
        return redirect(url_for('status_page'))

    # Get the UUID from the form
    uuid_from_form = request.args.get('uid')

    # Get the UUID from the cookie
    uuid_from_cookie = request.cookies.get('uuid')

    # If the UUID is provided in the form, use it. Otherwise, use the one from the cookie.
    uuid = uuid_from_form or uuid_from_cookie

    if not uuid:
        return render_template('error.html', message="No UUID found. Please enter a UUID.")

    # Check if the user clicked on the "Get All Status" button
    if request.args.get('get_all_status') == 'true':
        # Get statuses and notes using both UUIDs
        statuses, notes = get_all_statuses_and_notes(uuid_from_form, uuid_from_cookie)
        # print("statuses: ", statuses)
        # print("notes: ", notes)
        return render_template('status.html', statuses=statuses, notes=notes)

    # If the user didn't click on the button, simply render the status page
    return render_template('status.html')





if __name__ == '__main__':
    app.run(debug=True)