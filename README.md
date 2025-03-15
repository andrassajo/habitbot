# HabitBot

HabitBot is a productivity application designed to help you track and manage your habits effectively.

## Setup and Run the App

### Prerequisites

- Node.js (v14 or higher)
- Docker (for local deployment)

### Development Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/habitbot.git
    cd habitbot
    ```

2. **Install dependencies:**
    ```sh
    pnpm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in both the frontend and backend directories and add the necessary environment variables.
    Refer to `.env.example` in each respective folder for the required variables.

4. **Run the application:**
    ```sh
    pnpm run dev
    ```

5. **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

### Local Docker Deployment
Before proceeding, ensure you update the environment variables:


1. **Configure environment variables:**
    - In the frontend `.env` file, change the backend URL to `http://backend:8000` instead of `http://localhost:8000`.
    - In the backend `.env` file, update the database URL to use `db` as the host instead of `localhost`.

    Ensure you have a `docker-compose.yml` file in the root directory with the necessary credentials and configurations. Here is an example snippet for the database service:
    ```yaml
    version: '3.8'
    services:
      db:
        image: postgres:17
        environment:
          POSTGRES_USER: yourusername
          POSTGRES_PASSWORD: yourpassword
          POSTGRES_DB: habitbot
        ports:
          - "5432:5432"
    ```
    
2. **Build and run the Docker containers:**
    ```sh
    docker-compose up --build
    ```

3. **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

Make sure to replace `yourusername` and `yourpassword` with your actual database credentials.

## Future Developments

We have several exciting features planned for future releases:

### Authentication
Implementing a robust authentication system to ensure user data is secure. This will include:
- User registration and login
- Password recovery
- OAuth integration with popular services like Google and Facebook

### File/Image Upload for Conversations
Allowing users to upload files and images within their conversations. This will include:
- Drag and drop file upload
- Image preview within the chat
- Support for various file types

### Editing Previous Messages
Providing users with the ability to edit their previous messages. This will include:
- Inline message editing
- Version history to track changes
- Permissions to control who can edit messages

Stay tuned for updates as we continue to improve HabitBot!

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.