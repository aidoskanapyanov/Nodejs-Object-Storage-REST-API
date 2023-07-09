export const getUserInfo = async (req, res) => {
  const { userId } = req.user;
  res.json({ userId });
};
