'use client'
import { useRouter } from "next/navigation";

export default function page({ params }: { params: { id: string } }) {

  const { id } = params; 

  if (!id) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile Page</h1>
      <p>User ID: {id}</p>
    </div>
  );
}
