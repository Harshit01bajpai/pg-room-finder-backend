const jwt=require("jsonwebtoken");

const authmiddleware= (req,res,next)=>{

   try{
      // 1️⃣ Authorization header se token lena
    const authHeader = req.headers.authorization;

    // 2️⃣ Check: header hai ya nahi
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    // 3️⃣ Check: Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }
     // 4️⃣ Token alag nikaalna
    const token = authHeader.split(" ")[1];

    // 5️⃣ Token verify karna
//     JWT verify karta hai:

// token fake hai?

// token expire ho gaya?

// secret match karta?

// ✔ Sahi → decoded data milega
// ❌ Galat → error throw hoga (catch me jayega)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 6️⃣ User data request me attach karna
    req.user = decoded;

    // 7️⃣ Request ko aage jaane dena
    next();
    }catch(error){
         return res.status(401).json({
      message: "Token is invalid or expired",
    });
    }
};

module.exports=authmiddleware;