export const getUserInfo = async (req, res) => {
  const { userId } = req.user;
  console.log(userId);

  res.json({ userId });
};
