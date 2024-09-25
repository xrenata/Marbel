# Marbel Discord Bot

Marbel is a Discord bot designed to enhance your server experience with various features and commands.

## Features

- Custom commands
- Moderation tools
- Fun and utility commands

## Getting Started

To get started with Marbel, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/xrenata/Marbel.git
    cd Marbel
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

3. Create a `config.yml` file in the root directory with the following content:

    ```yaml
    token: "your_secret_token"
    clientId: 'your_clientId'
    guildId: '' # Optional
    databaseURL: 'mongodb://localhost:27017' # Required
    status : {
    type: 'online', # Options: 'online', 'idle', 'dnd', 'invisible'
    activity: 'CustomStatus', # Options: 'Playing', 'Listening', 'Watching', 'CustomStatus'
    text: 'Hello World!' # Required 
    }
    dev: {
    developers: ['937316083533230110'], # For admin, eval and reload commands
    guildId: '1288559438675972159', # Required
    blackListLog: '1288609577738178560', # Optional
    }
    ```

4. Run the bot:
    ```sh
    npm start
    ```

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.