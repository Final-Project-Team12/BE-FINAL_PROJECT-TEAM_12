-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "telephone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "identity_number" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "otp" TEXT,
    "otp_expiry" TEXT,
    "reset_token" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "redirect_url" TEXT NOT NULL,
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "total_payment" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "plane_id" INTEGER NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Passenger" (
    "passenger_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "identity_number" TEXT NOT NULL,
    "issuing_country" TEXT NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("passenger_id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "seat_id" SERIAL NOT NULL,
    "class" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "plane_id" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "Plane" (
    "plane_id" SERIAL NOT NULL,
    "airline_id" INTEGER NOT NULL,
    "airport_id_origin" INTEGER NOT NULL,
    "airport_id_destination" INTEGER NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "departure_terminal" TEXT NOT NULL,
    "baggage_capacity" DOUBLE PRECISION NOT NULL,
    "plane_code" TEXT NOT NULL,
    "cabin_baggage_capacity" DOUBLE PRECISION NOT NULL,
    "meal_available" BOOLEAN NOT NULL,
    "wifi_available" BOOLEAN NOT NULL,
    "in_flight_entertainment" BOOLEAN NOT NULL,
    "power_outlets" BOOLEAN NOT NULL,
    "offers" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Plane_pkey" PRIMARY KEY ("plane_id")
);

-- CreateTable
CREATE TABLE "Airline" (
    "airline_id" SERIAL NOT NULL,
    "airline_name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "times_used" INTEGER NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("airline_id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "airport_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "airport_code" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "times_visited" INTEGER NOT NULL DEFAULT 0,
    "continent_id" INTEGER NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("airport_id")
);

-- CreateTable
CREATE TABLE "Continent" (
    "continent_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Continent_pkey" PRIMARY KEY ("continent_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "snapToken" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_file_id_key" ON "Airline"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_file_id_key" ON "Airport"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "Passenger"("passenger_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "Seat"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "Plane"("plane_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plane" ADD CONSTRAINT "Plane_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "Airline"("airline_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plane" ADD CONSTRAINT "Plane_airport_id_origin_fkey" FOREIGN KEY ("airport_id_origin") REFERENCES "Airport"("airport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plane" ADD CONSTRAINT "Plane_airport_id_destination_fkey" FOREIGN KEY ("airport_id_destination") REFERENCES "Airport"("airport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Airport" ADD CONSTRAINT "Airport_continent_id_fkey" FOREIGN KEY ("continent_id") REFERENCES "Continent"("continent_id") ON DELETE RESTRICT ON UPDATE CASCADE;
