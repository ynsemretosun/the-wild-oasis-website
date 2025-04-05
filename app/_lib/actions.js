"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { getBookings, updateGuest } from "./data-service";
import { supabase } from "./supabase";
import { redirect } from "next/navigation";

//if we use bind, the first argument will be the bookingData object which is passed to the action function
export async function createReservation(reservationData, formData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to create a reservation.");
  }
  const newBooking = {
    ...reservationData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: reservationData.cabinPrice,
    hasBreakfast: false,
    isPaid: false,
    status: "unconfirmed",
  };
  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }
  revalidatePath("/account/reservations");
  revalidatePath(`/cabins/${reservationData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateProfile(formData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to update your profile.");
  }
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality")?.split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("National ID must be between 6 and 12 characters long.");
  }

  const updateData = { nationality, countryFlag, nationalID };
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/profile");
}

export const deleteReservation = async (reservationId) => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to delete a reservation.");
  }

  const reservations = await getBookings(session.user.guestId);
  const reservationIds = reservations.map((reservation) => reservation.id);

  if (!reservationIds.includes(reservationId)) {
    throw new Error("You don't have permission to delete this reservation.");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", reservationId);

  if (error) {
    console.log(error);
    throw new Error("Reservation could not be deleted");
  }
  revalidatePath("/account/reservations");
};

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to update a reservation.");
  }
  const reservationId = parseInt(formData.get("reservationId"));
  const reservations = await getBookings(session.user.guestId);
  const reservationIds = reservations.map((reservation) => reservation.id);

  if (!reservationIds.includes(reservationId)) {
    throw new Error("You don't have permission to update this reservation.");
  }

  const updateData = {
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
  };
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", reservationId);

  if (error) {
    throw new Error("Reservation could not be updated");
  }
  revalidatePath(`/account/reservations/edit/${reservationId}`);
  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
