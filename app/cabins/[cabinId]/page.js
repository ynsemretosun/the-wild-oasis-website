import Cabin from "@/app/_components/Cabin";
import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import Reservations from "@/app/_components/Reservations";
import Spinner from "@/app/_components/Spinner";
import TextExpander from "@/app/_components/TextExpander";
import {
  getBookedDatesByCabinId,
  getCabin,
  getCabins,
  getSettings,
} from "@/app/_lib/data-service";
import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const id = await params.cabinId;
  const { name } = await getCabin(id);

  return {
    title: `Cabin ${name}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const cabinIds = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));
  return cabinIds;
}

export default async function Page({ params }) {
  const id = await params.cabinId;

  const cabin = await getCabin(id);
  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />

      <div>
        <h2 className="text-5xl font-semibold text-center text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservations cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
