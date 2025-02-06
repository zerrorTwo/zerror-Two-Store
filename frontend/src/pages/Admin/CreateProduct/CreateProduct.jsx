import { useParams } from "react-router-dom";
import { useLazyGetProductByIdQuery } from "../../../redux/api/productSlice";
import { useState, useEffect } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import TabPanel from "../../../components/ProductTab/TabPanel";
import InforTab from "./InforTab";
import ImageTab from "./ImageTab";
import PriceTab from "./PriceTab";
import VariationTab from "./VariationTab";
import ConfirmTab from "./ConfirmTab";
import PropTypes from "prop-types";

function CreateProduct() {
  const { id } = useParams();
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    mainImg: null,
    type: "",
    status: false,
    img: [],
    variations: {},
  });

  const [getProductById, { data: productData }] = useLazyGetProductByIdQuery();

  useEffect(() => {
    if (id) {
      getProductById(id);
    }
  }, [id, getProductById]);

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        mainImg: productData.mainImg,
        type: productData.type,
        status: productData.status,
        img: productData.img,
        variations: productData.variations,
      });
    }
  }, [productData]);

  const handleResetFormData = () => {
    setValue(0);
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      mainImg: null,
      type: "",
      status: false,
      img: [],
      variations: {},
    });
  };

  const handleNext = () => setValue((prev) => prev + 1);
  const handlePre = () => setValue((prev) => prev - 1);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Tabs
        value={value}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value={0} label="Title/ Information" />
        <Tab value={1} label="Image" />
        <Tab value={2} label="Price" />
        <Tab value={3} label="Attribute" />
        <Tab value={4} label="Confirm" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <InforTab
          onNext={handleNext}
          formData={formData}
          setFormData={setFormData}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImageTab
          onPre={handlePre}
          onNext={handleNext}
          formData={formData}
          setFormData={setFormData}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PriceTab
          onPre={handlePre}
          onNext={handleNext}
          formData={formData}
          setFormData={setFormData}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <VariationTab
          onPre={handlePre}
          onNext={handleNext}
          formData={formData}
          setFormData={setFormData}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ConfirmTab
          handleResetFormData={handleResetFormData}
          onPre={handlePre}
          formData={formData}
          create={!id}
          id={id}
        />
      </TabPanel>
    </Box>
  );
}

CreateProduct.propTypes = {
  update: PropTypes.bool,
};

export default CreateProduct;
