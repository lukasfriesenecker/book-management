import { Navbar } from "@/components/Navbar";


const Collection = () => {
    return (
        <>
        < Navbar userId={1} username="John Doe" />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Collection</h1>
            <p className="text-gray-600">List of books in the collection will be displayed here.</p>
        </div>
        </>
    );
}
export default Collection;