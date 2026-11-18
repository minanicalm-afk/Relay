import { ArrowLeft, Recycle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-cream py-20">
      <Container className="text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-forest-100 text-forest-700">
          <Recycle className="h-10 w-10" />
        </span>
        <p className="mt-8 font-display text-6xl font-bold text-forest-900">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-forest-950 sm:text-3xl">
          This page took a different route.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-forest-900/75">
          The page you are looking for does not exist or may have moved. Let us
          get you back to something useful.
        </p>
        <Button href="/" className="mt-8" size="lg" icon={<ArrowLeft className="h-4 w-4" />} iconRight={false}>
          Back to home
        </Button>
      </Container>
    </section>
  );
}
