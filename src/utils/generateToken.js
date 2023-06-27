import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1m',
    algorithm: 'HS256'
  });
  return token;
};

export default generateToken;
