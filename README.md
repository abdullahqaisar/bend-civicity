# Civicity: City-to-City Carpooling App

Civicity is a mobile application designed to facilitate city-to-city carpooling, connecting riders with drivers to provide a convenient, affordable, and sustainable transportation option. This repository contains the server-side code for Civicity, implemented in Node.js, Express.js, and MongoDB.

## Features

- **User Registration**: Easily create accounts to access Civicity's features.
- **Driver Registration**: Registered users can list their vehicles, becoming drivers and offering carpool rides to others.
- **Ride Search**: Users can search for available carpool rides based on origin, destination, date, and time preferences.
- **Ride Booking**: Riders can book seats in carpool rides offered by drivers.
- **Ride Management**: Drivers can manage rides, including accepting or rejecting booking requests, communicating with riders, and tracking trip progress.
- **Rating System**: Users can rate their ride experience and drivers, promoting accountability and trust within the community.

## Benefits:

- **Cost-effective**: Carpooling allows users to share travel expenses, providing a budget-friendly alternative to traditional travel options.
- **Sustainable**: By reducing the number of single-occupancy vehicles on the road, carpooling contributes to environmental sustainability.
- **Convenient**: Civicity provides a user-friendly platform for finding and booking carpool rides, streamlining the travel process.
- **Social Interaction**: Carpooling fosters connections between riders and drivers, creating a sense of community.

## Getting Started

Follow the steps below to set up and run Civicity on your local machine.

### Prerequisites

Before you begin, make sure you have the following software installed on your system:

- [Node.js](https://nodejs.org/) - JavaScript runtime environment.
- [MongoDB](https://www.mongodb.com/) - A NoSQL database for storing data.

### Installation

1. Clone the Civicity repository to your local machine:

   ```bash
   git clone https://github.com/abdullahqaisar/bend-civicity.git
   ```

2. Install dependencies:

   ```bash
   # Navigate to the project folder and install backend dependencies
   npm install
   ```

3. Configure the project as per the Configuration section below.

4. Start servers:

   ```bash
   # Start the server
   npm start
   ```

5. Access the APIs at [http://localhost:PORT](http://localhost:PORT).

## Configuration

### Environment Variables

To configure the project, set up environment variables. Create a `.env` file in the project directory and add the following variables:

```env
PORT=3001
JWT_KEY="secretkey"
DATABASE_CONNECTION=your-mongodb-uri
```

- `PORT`: Port on which the Node.js server will run.
- `DATABASE_CONNECTION`: Your MongoDB connection URI.
- `JWT_KEY`: Secret key for JWT token generation.

Create a `config` folder in the project directory and create a `default.json` file in it

```default.json
{
  "logLevel": "info",
  "production": false
}
```

- `logLevel`: The level of logging (Info, Debug, etc...).
- `production`: Checks if the environment is production.

## Contributing

If you'd like to contribute to the project, please follow our [Contribution Guidelines](CONTRIBUTING.md).

---

Thank you for choosing Civicity! If you have any questions or need assistance, feel free to contact us.
