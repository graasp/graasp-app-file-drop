const downloadHelper = async (blob, name) => {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = name;
  link.click();
};

export default downloadHelper;
