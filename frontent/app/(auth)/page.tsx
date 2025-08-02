import TeamAndFooterCard from "@/components/Nabvar/about";
import FilterSidebar from "@/components/ui/FilterSidebar";
import HeroSection from "@/components/ui/HeroSection";
import ProductList from "@/components/ui/ProductCard";

const categories = [
  "All",
  "Grocery",
  "Clothing",
  "Kids",
  "Stationery",
  "Kitchen",
  "Furniture",
  "Electronics",
  "Electrical",
  "Sports",
  "Fashion",
  "Home",
  "Books",
];

export default function HomePage() {
  return (
    <main className="p-6 max-w-full mx-auto">
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 rounded-full border text-sm hover:bg-slate-200"
          >
            {category}
          </button>
        ))}
      </div>

      <HeroSection />

      <div className="flex flex-col md:flex-row gap-2">
        <FilterSidebar />
        
      </div>
      <TeamAndFooterCard />
    </main>
  );
}
