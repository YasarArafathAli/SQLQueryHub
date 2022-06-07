import React,{useState} from "react";
import Papa from "papaparse";

const allowedExtensions = ["csv", "json"];
export default function App() {
  const [data, setData] = useState([])
  const [columns,setColumns] = useState([])

  const [error, setError] = useState("");
  const [range, setRange] = useState([0,10]);

  const [file, setFile] = useState("");

  const handleFileChange = (e) => {
    setError("");
     
    // Check if user has entered the file
    if (e.target.files.length) {
        const inputFile = e.target.files[0];
         
        // Check the file extensions, if it not
        // included in the allowed extensions
        // we show the error
        const fileExtension = inputFile?.type.split("/")[1];
        if (!allowedExtensions.includes(fileExtension)) {
            setError("Please input a csv file");
            return;
        }

        // If input type is correct set the state
        setFile(inputFile);
    }
};
const handleParse = () => {
     
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();
     
    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
        const csv = Papa.parse(target.result, { header: true });
        const parsedData = csv?.data;
        setData(parsedData);
        const columnsData = Object.keys(parsedData[0]);
        setColumns(columnsData);
        console.log(data,columns)
    };
    reader.readAsText(file);
};

const handleRange1 = () => setRange([0,10])
const handleRange2 = () => {
  let n = data.length  
  setRange([n-10,n])
}
const handleRange3 = () => {
  let n = data.length  
  setRange([0,n])
}

  return (
      <div>
      <div className = 'navbar'> Navbar </div>
      <div className="main">
        <div className="queryBox">query input</div>
        <div className ='tableBox'> <div>
            <label htmlFor="csvInput" style={{ display: "block" }}>
                Enter CSV File
            </label>
            <input
                onChange={handleFileChange}
                id="csvInput"
                name="file"
                type="File"
            />
                <button onClick={handleParse}>Load Data</button>
                <button onClick={handleRange1}>First 10 Records</button>
                <button onClick={handleRange2}>Last 10 Records</button>
                <button onClick={handleRange3}>Show all records</button>

            
            <table style={{maxWidth: '95vw'}}>
  <tr>
  {error ? error : columns.map((col,
                  idx) => <th key={idx}>{col}</th>)}
  </tr>
  {error ? error : data.slice(range[0], range[1]).map( row => <tr key={row.customerID} >
  
  {Object.entries(row).map(item => <td>{item[1]}</td>)}
  
  </tr>)}
</table>
        </div></div>
      </div>
      </div>
  );
}
