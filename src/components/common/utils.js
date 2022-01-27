const downloadHelper = async (response, resource) => {
  const blob = new Blob([await response.blob()], {
    type: response.headers.get('Content-Type'),
  });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${resource.data.name}`;
  link.click();
};

export default downloadHelper;
