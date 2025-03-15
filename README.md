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
    npm start
    ```

5. **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

### Local Docker Deployment
1. **Build and run the Docker containers:**
    ```sh
    docker-compose up --build
    ```

2. **Configure environment variables:**
    Ensure you have a `docker-compose.yml` file in the root directory with the necessary credentials and configurations. Here is an example snippet for the database service:
    ```yaml
    version: '3.8'
    services:
      db:
        image: postgres:13
        environment:
          POSTGRES_USER: yourusername
          POSTGRES_PASSWORD: yourpassword
          POSTGRES_DB: habitbot
        ports:
          - "5432:5432"
    ```

3. **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

Make sure to replace `yourusername` and `yourpassword` with your actual database credentials.

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.