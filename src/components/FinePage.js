import Link from 'next/link';

const FinePage = () => {
  const { amount } = { amount: 50 }; // Example amount

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Fine Payment</h1>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Total Fine: ₹{amount}</h2>
        <p className="mt-2">Please pay the fine to return the book.</p>
        <Link href="/">
          <button className="mt-4 p-2 bg-blue-500 text-white rounded">
            Pay Fine
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FinePage;
