# HR Demo Frontend

A modern administrative dashboard for managing employee datas.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager (v10.23.0+)

**The version I used** : _Node.js (v22.23.1)_ and pnpm (11.17.0)

### Project Setup & Run Instructions

```bash
1
# Clone repository
git clone https://github.com/kaungMinn/HR-Frontend.git

2
# Navigate to project directory
cd HR-Frontend

3
# Create .env file in the root of the project
# Copy everything from .env.example into .env and save

4
# Install dependencies
pnpm install

5
# Start development server
pnpm run dev
```

## Architecture & Choice Decision

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   └── dashboard/     # Dashboard-specific components
├── features/          # Feature-based modules
│   ├── auth/          # Auth features
│   └── employee/      # Employee features
├── layouts/           # Layout components
├── constants/         # Application constants
├── utils/             # Utility functions
└── assets/            # Static assets
```

### ⚡ Why did i choose Feature-First Architecture ?

I chose a feature-first (domain-driven) architecture over a traditional layer-first approach (grouping strictly by components, hooks, or pages) for the following core reasons:

- **High Scalability & Modularity:** As an enterprise HR application grows, keeping all files related to a specific feature (e.g., employee, payroll, auth) neatly isolated inside its own folder (src/features/employee) prevents the codebase from becoming messy and hard to navigate.

- **Improved Maintainability:** Developers can find, update, or refactor everything related to a single business feature (components, routing, APIs, and state management) in one localized place without having to jump across distant directories.

- **Better Team Collaboration:** It allows multiple developers or teams to work on separate features concurrently with minimal risk of merge conflicts, as changes remain scoped to their respective feature modules.

- **Clear Separation of Concerns:** True global elements (like shared UI primitives or layouts) remain cleanly abstracted in src/components and src/layouts, while business logic stays tightly coupled to the domain it serves.

## Data Fetching, Caching, and Error Handling Strategy

Our application implements a robust, enterprise-grade architecture for managing server state, client storage, API communication, and failure recovery.

### 1. How It Works (The Technical Mechanism)

Server State & Caching (@tanstack/react-query):

- I configured a central QueryClient globally in **main.tsx**

- **Stale-While-Revalidate:** Queries are cached for 5 minutes (staleTime: 5 _ 60 _ 1000), reducing redundant backend requests.

- **Optimized Refetching: refetchOnWindowFocus:** false prevents unnecessary background data refetches when users switch browser tabs.

- **Global Mutation Side Effects:** Mutations automatically intercept responses. Successful operations trigger toast notifications globally if response.data.success is true, while 422 validation errors are parsed and bubbled up automatically.

- **Client Persistence (Redux Toolkit & Redux Persist):** `<Provider>` and `<PersistGate>` wrap the app to safely sync parts of application state into local storage, ensuring user preferences or sessions persist across page reloads.

- **Secure API Interception & Token Rotation (Axios Interceptors):** Before any request is sent (onRequest), Axios intercepts it to attach the Bearer token retrieved from cookies.

- **Proactive Token Refresh:** It decodes the JWT using jwt-decode and checks the expiration (user.exp). If the access token has expired, it automatically triggers a refreshTokenApi() call, updates the cookie, and seamlessly resumes the original request.

- **Unauthorized Safety (401 Interceptor):** If a request fails with an unauthorized status (401), the response interceptor automatically purges all stored tokens/data and forces a redirect to `/auth/login`.

- **Global Error Boundary (react-error-boundary):** The entire root is wrapped in an ErrorBoundary. If any unhandled JavaScript runtime error crashes the UI tree, a user-friendly fallback alert component renders instead of a blank white screen.

### 2. ⚡ Why I Used This Strategy

- **Separation of Server State vs. Client State:** By using TanStack Query for server requests and Redux for local/persisted app state, I prevent state synchronization bugs and leverage automatic background caching, deduplication, and garbage collection.

- **Seamless User Experience (UX):** Automatic proactive token refresh ensures that users are almost never unexpectedly logged out mid-task due to an expired access token.

- **Reliability and Fault Tolerance:** Global error boundaries and centralized Axios mutation/error interceptors ensure that network crashes, validation errors, or component failures are handled gracefully without breaking the layout or leaving the user stranded.

- **Security Best Practices:** Utilizing HTTP-only/secure client cookies combined with interceptors safeguards sensitive credential handling compared to storing tokens in vulnerable storage blocks.

## Authentication and token-refresh approach

Our application implements a secure, seamless JSON Web Token (JWT) authentication workflow utilizing Axios Interceptors, secure cookies, and proactive token rotation to ensure uninterrupted user experience and high security.

### 1. How It Works (The Technical Flow)

- I configured auth related things in **/src/api/instance.ts** and **/services/api.ts**

- **Token Storage via Secure Cookies:** Upon successful login, the authentication tokens(such as accesstoken) are securely stored using cookies rather than vulnerable storage mechanisms like standard localStorage, protecting against cross-site scripting (XSS) risks.

- **Secure Refresh Token Management (HttpOnly Cookies):** The refresh token is managed by the Node.js backend and stored as an HttpOnly secure cookie. Because it is marked HttpOnly, malicious client-side scripts cannot access, read, or steal it via XSS.

- **Request Interception & Proactive Expiration Check (onRequest):** Before any API request is sent, our `global Axios request interceptor` intercepts it. It automatically attaches the Bearer token to the request headers (Authorization: Bearer <token>).It decodes the JWT on the client side using jwt-decode to read its payload (specifically the exp timestamp).

- **Proactive Refresh:** It checks if the token has expired `(user.exp * 1000 < Date.now())`. If the access token is about to expire or has expired, it automatically triggers refreshTokenApi() before letting the request fail, updates the cookie with the newly issued access token, and seamlessly proceeds with the original request.

- **Unauthorized Request Handling (onResponseError):** If a request fails with a 401 Unauthorized status code from the server (meaning the refresh token also expired or was invalidated): The response interceptor instantly wipes all application storage (clearAllCookies() and clearAllLocalStorage()).It forces an immediate redirection to the login page (/auth/login), preventing the user from getting stuck in an invalid state.

### 2. ⚡ Why I Used This Strategy

- **Seamless User Experience (UX):** By using proactive token refreshing via interceptors, users can work continuously in the application without being abruptly logged out mid-task due to an expired access token.

- **Centralized Security Management:** Handling authentication logic inside Axios interceptors means individual components or API hooks don't need to manually check token validity or handle retry logic—it happens transparently in the background.

- **Robust Error Recovery:** Global handling of 401 errors ensures that expired sessions cleanly reset the application state and safely route the user back to authentication.

## The selected solution for client-side state

### ⚡ Why Redux Toolkit (RTK)?

While React has several ways to manage global client state, I chose Redux Toolkit for our enterprise HR application due to the following benefits:

- **Predictable & Centralized State Container:** As an HR platform grows, managing shared states (such as user session preferences, sidebar collapse states, or multi-step configurations) requires a predictable architecture. RTK provides a single source of truth that prevents state drift across deeply nested components.

- **Elimination of Boilerplate Code:** Traditional Redux was infamous for verbose code (writing separate action types, action creators, and switch-case reducers). RTK solves this by using slices, allowing us to write concise, modern, and readable logic out of the box.

- **Built-in Best Practices:** RTK comes pre-configured with industry-standard tools like Immer (allowing us to write "mutating" syntax safely inside reducers without manual state copying) and built-in support for asynchronous logic and debugging via Redux DevTools.

- **Seamless Local Persistence:** RTK integrates effortlessly with Redux Persist, enabling us to instantly save specific client-state slices to local storage with minimal configuration.

## Code Quality, Linting, & Git Workflow Automation

To maintain a consistent, error-free, and clean codebase across development, my project integrates a strict automated toolchain utilizing Antfu's ESLint config, Airbnb-inspired styling rules, Husky (Git Hooks), Lint-Staged, and VS Code workspace configuration.

### 1. How It Works (The Technical Mechanism)

- **Stricter Standards via @antfu/eslint-config & Airbnb Rules:** I adopted @antfu/eslint-config as our base linting engine, combined with strict code rules (including Airbnb-inspired style guides). This enforces rigid formatting, consistent file naming conventions, clean imports, and type safety out of the box.

- **Automated Pre-Push Checks via Husky & Lint-Staged:** We configured Husky to intercept Git actions. Before any code can be pushed to the remote repository, a pre-push Git hook automatically executes pnpm lint. Using Lint-Staged, the linter scans and verifies code styles (including file naming and syntax correctness) across staged files. If any style violations or lint errors are found, the push is instantly blocked until resolved.

- **Instant Auto-Fixing via Terminal & IDE Integration:** Developers can instantly scan and auto-correct formatting or syntax bugs across the entire repository by running: `pnpm lint:fix  `. Additionally, we configured the project's .vscode workspace settings, enabling "Fix on Save". Whenever a developer saves a file in VS Code, code formatting and lint rules are automatically applied instantly.

### 2. Why I Used This Strategy

- **Guaranteed Code Consistency:** Enforcing strict file-naming conventions and formatting rules prevents style wars and keeps the entire feature-first codebase looking like it was written by a single developer.

- **Zero Broken Builds in Git:** Catching syntax errors, missing types, and bad formatting before code hits the repository ensures that the shared main branch always remains clean, deployable, and bug-free.

- **Maximum Developer Experience (DX):** By pairing automated pre-push hooks with VS Code's "Fix on Save", code quality maintenance happens seamlessly in the background without slowing down developer velocity.

## Dummy Credentials for Login

- **username:** kaung
- **password:** Monkey$99
