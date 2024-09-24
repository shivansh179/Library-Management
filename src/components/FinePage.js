import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinePage = ({ returnDate }) => {
  const navigate = useNavigate();
  const [fineAmount, setFineAmount] = useState(0);
  
  useEffect(() => {
    const calculateFine = () => {
      const today = new Date();
      const returnDateObj = new Date(returnDate);
      const diffTime = today - returnDateObj; // difference in milliseconds
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
      const finePerDay = 5;
      const totalFine = diffDays > 0 ? diffDays * finePerDay : 0;
      setFineAmount(totalFine);
    };

    calculateFine();
  }, [returnDate]);

  const handletransfer=()=>{
    navigate("/user/dashboard");
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Fine Payment</h1>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Total Fine: ₹{fineAmount}</h2>
        <p className="mt-2">Please pay the fine to return the book.</p>
        
          <button  onClick={handletransfer} className="mt-4  p-2 bg-blue-500 text-white rounded">
            Pay Fine
          </button>
      
      </div>
    </div>
  );
};

export default FinePage;
