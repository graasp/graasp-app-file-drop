const downloadHelper = async (blob: Blob, name: string): Promise<void> => {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = name;
  link.click();
};

export default downloadHelper;
