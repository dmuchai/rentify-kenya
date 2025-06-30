import ListingCard from "@/components/custom/ListingCard";
import { mockProperties } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      {/* We will add a Hero/Search section here later */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProperties.map((property) => (
            <ListingCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </div>
  );
}
