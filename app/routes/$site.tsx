import { useParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params.postId);
};

export default function SiteRoute() {
  const params = useParams();
  console.log(params.postId);

  return <main>Luca</main>;
}
