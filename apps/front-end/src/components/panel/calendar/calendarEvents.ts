export const getEventStyle = (id: number) => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ];
  const gradient = gradients[id % gradients.length];
  return {
    style: {
      background: gradient,
      color: "white",
      borderRadius: "10px",
      border: "none",
      padding: "4px 8px",
      fontWeight: 600,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
    },
  };
};
