import { TextField, Box } from "@mui/material";

import { useState } from "react";
import "./App.css";
import BinaryTreeCanvas from "./components/Canvas";

function App() {
  const [inputBoxValue, setInputBoxValue] = useState("");
  const [treeValues, setTreeValues] = useState<Array<string>>([]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      target: { value },
    } = event;

    setInputBoxValue(value);

    setTreeValues(value.split(","));
  }

  return (
    <div className="App">
      <h1>Binary Tree Generator</h1>
      <Box
        component={"form"}
        onSubmit={(e) => e.preventDefault()}
        display="flex"
        justifyContent={"center"}
        sx={{ padding: 1 }}
      >
        <TextField
          variant="outlined"
          value={inputBoxValue}
          onChange={handleChange}
          size="small"
          placeholder="Enter comma separated value like, 1,2,3,4,...,n"
          fullWidth
        />
      </Box>
      <Box>
        <BinaryTreeCanvas treeNodes={treeValues} />
      </Box>
    </div>
  );
}

export default App;
