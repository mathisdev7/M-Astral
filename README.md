# F'Threads

**F'Threads** is a modern social media platform that allows users to share thoughts, ideas, and connect with others. This project is built with Next.js and leverages various technologies to provide a smooth and responsive user experience.

## Features

- **Authentication**: Managed via [NextAuth](https://next-auth.js.org/) with providers like Google, GitHub, Discord, and Auth0.
- **Thread Management**: Create, comment on, and like threads with pagination.
- **Notifications**: Receive notifications for interactions on your threads.
- **User Profile**: Edit your profile information and manage visibility.
- **Privacy Policy and Terms of Use**: Dedicated pages to inform users about data management.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (version 14.2.7) for server-side and client-side development.
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/) as the ORM for data management.
- **Styles**: [Tailwind CSS](https://tailwindcss.com/) for design and layout.
- **UI**: [Shadcn UI](https://ui.shadcn.com/) for UI components.
- **State Management**: [Context API](https://reactjs.org/docs/context.html) and hooks for managing application state.
- **Notifications**: [Shadcn UI](https://ui.shadcn.com/) for toast notifications.
- **Environment**: Use environment variables for secure configuration.

## Installation

1. **Clone the repository**:

   ```bash
   git clone git@github.com:mathisdev7/Fthreads.git Fthreads
   cd Fthreads
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

   or

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   Rename the `.env.example` file to `.env` and configure the variables as needed.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   Access the application at [http://localhost:3000](http://localhost:3000) to see it in action.

## Contributing

Contributions are welcome! Please follow the contribution guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file to propose improvements or report issues.

## License

This project is licensed under the [MIT](LICENSE) License.
