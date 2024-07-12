import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useAdmin from "@/controllers/useAdmin";
import useNotify from "@/hooks/useNotify";

interface CreateCategoryComponentProps {
  onClose: () => void;
}

const CreateCategoryComponent = ({ onClose }: CreateCategoryComponentProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const { createNewCategory } = useAdmin();
  const { errorNotify, successNotify } = useNotify();

  const handleCreateCategory = async () => {
    try {
      const response = await createNewCategory({
        name: categoryName,
        description: description,
      });
      if (response.status === 201) {
        onClose();
        successNotify("Create category successfully");
      } else {
        errorNotify("Create category failed");
      }
    } catch (error) {
      errorNotify("Create category failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        borderRadius: "10px",
        backgroundColor: "white",
        width: "500px",
      }}
    >
      <Typography
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Create Category
      </Typography>
      <Grid container>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          Category Name
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          Description
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Grid>
      </Grid>
      {/* <Button variant="contained" onClick={handleCreateCategory}>
        Create Category
      </Button> */}

      <Grid
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={handleCreateCategory}
          variant="contained"
          sx={{ width: 200, height: 50, marginTop: 5 }}
          type="submit"
        >
          Create Category
        </Button>
      </Grid>
    </Box>
  );
};

export default CreateCategoryComponent;
