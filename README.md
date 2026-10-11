# ElevateBox-AI

### AI-Powered Sales Intelligence & Lead Management Platform

ElevateBox-AI is a sales intelligence platform designed to streamline business prospecting, automate customer conversations through voice calling, and organize qualified leads in a centralized dashboard.

The platform integrates a Node.js backend, a React dashboard, Twilio voice calling, and a lead qualification system to help businesses manage prospects and understand their sales opportunities.

## Features

* **Sales Dashboard:** View lead statistics, prospect distribution, and sales pipeline information.
* **Lead Management:** Store, retrieve, search, and filter business prospects.
* **Lead Qualification:** Classify prospects using lead scores and status categories.
* **Voice Calling Integration:** Initiate outgoing calls using the Twilio API.
* **Multilingual Conversation Support:** Includes English, Hindi, and Telugu conversation flows.
* **Automated Lead Storage:** Persist prospect information in a local JSON file.
* **Budget & Timeline Tracking:** Organize customer requirements and potential opportunities.
* **Responsive Interface:** Access sales information through a modern React-based dashboard.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Lucide React

### Backend

* Node.js
* Express.js
* REST API
* CORS

### Calling & Conversation Processing

* Twilio Voice API
* Speech input through Twilio webhooks
* Rule-based conversational response generation
* Lead classification and scoring

### Data Storage

* JSON-based local storage

## Architecture

The application follows a modular frontend-backend architecture.

```text
ElevateBox-AI
│
├── src
│   ├── ai
│   │   ├── conversationManager.js
│   │   ├── leadClassifier.js
│   │   └── languageDetector.js
│   │
│   ├── routes
│   │   ├── callRoutes.js
│   │   └── leadRoutes.js
│   │
│   ├── services
│   │   ├── aiService.js
│   │   ├── leadStore.js
│   │   └── telephonyService.js
│   │
│   └── server.js
│
├── data
│   └── leads.json
│
├── frontend
│   └── src
│       ├── App.jsx
│       └── App.css
│
├── .env
├── .gitignore
└── README.md
```

## Application Workflow

1. A user initiates an outgoing call through the calling interface.
2. The backend requests an outgoing call through Twilio.
3. Twilio accesses the application's publicly reachable webhook.
4. Customer speech is processed by the conversation service.
5. The lead classifier evaluates the available conversation information.
6. The lead storage service saves or updates the prospect record.
7. The frontend retrieves lead information through the REST API.
8. The dashboard displays prospect statistics, scores, budgets, timelines, and statuses.

## Getting Started

### Prerequisites

Install the following tools before running the project:

* Node.js and npm
* Git
* A Twilio account for real voice calling

### 1. Clone the Repository

```bash
git clone https://github.com/tripteaaa-codes/Elevatebox.git
cd ElevateBox-AI
```

Use the actual directory created by Git if its name differs.

### 2. Install Backend Dependencies

From the project root, run:

```bash
npm install
```

### 3. Configure Environment Variables

Create or update the `.env` file in the project root:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
PUBLIC_URL=https://your-public-tunnel-url
PORT=5000
```

Replace the example values with your own configuration.

Never commit your `.env` file or publish your Twilio authentication token.

### 4. Start the Backend

From the project root, run:

```bash
npm run dev
```

The backend is expected to run on port 5000.

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Open the local URL printed by Vite, typically:

```text
http://localhost:5173
```

Keep both development servers running while testing the application.

## API Endpoints

| Method | Endpoint                     | Purpose                          |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/api/leads`                 | Retrieve saved leads             |
| GET    | `/api/leads?status=Hot`      | Filter leads by status           |
| GET    | `/api/leads?search=Clothing` | Search leads                     |
| GET    | `/api/leads/:id`             | Retrieve a specific lead         |
| POST   | `/api/call/start`            | Request an outgoing call         |
| POST   | `/api/call/twiml`            | Provide Twilio call instructions |
| POST   | `/api/call/process`          | Process customer speech          |

The calling endpoints require appropriate configuration and should be tested using authorized phone numbers.

## Current Development Status

* React dashboard implemented.
* Express backend configured.
* Lead management API implemented.
* JSON-based lead persistence implemented.
* Lead classification and conversation processing integrated.
* Twilio outgoing calling integration implemented.
* End-to-end calling and lead persistence require successful testing with an active Twilio account.

**Current limitation:** Real outgoing calls are unavailable while the configured Twilio trial account is expired. An active, appropriately configured account is required to validate the complete voice-calling workflow.

## Security Considerations

* Keep API credentials and authentication tokens private.
* Exclude `.env` from version control.
* Use authorized destinations for test calls.
* Validate incoming requests and secure public webhook endpoints before production deployment.
* Consider a database and stronger persistence controls before deploying for multiple users.

## Future Improvements

* Database-backed lead management.
* More advanced conversational AI.
* Improved lead qualification and analytics.
* Call history and outcome tracking.
* Authentication and role-based access control.
* Production deployment and monitoring.

## Author

**Tripti Kashyap**

GitHub: [tripteaaa-codes](https://github.com/tripteaaa-codes)

---

*ElevateBox-AI — Every conversation, a new opportunity.*
