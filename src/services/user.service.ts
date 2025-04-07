import Payment from '../models/user/payment.model';
import User from '../models/user/user.model';
import { hashPassword } from '../utils/authUtils';
import { sendEmail } from '../utils/email.service';

interface UserRegistrationData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  referralCode?: string;
}

export default class UserService {
  // Fetch all users with specific fields
  static async getAllUsers() {
    return await User.findAll({
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname'],
    });
  }

  static async getUserById(userId: any) {
    return await User.findByPk(userId);
  }

  static async get7thParentUserDetails(userId: number, depth: number = 0): Promise<User | null> {
    // Base case: if we've reached beyond 7 levels, return null
    if (depth > 7) return null;

    // Find the current user by userId
    const currentUser = await User.findOne({ where: { userId } });

    // If no user is found, return null
    if (!currentUser) return null;

    // If we have reached the 7th level, return the user details
    if (depth === 7) {
      return currentUser; // Return the 7th parent user details
    }

    // If the current user has no parent (parentUserId is null), stop the recursion
    if (!currentUser.parentUserId) return null;

    // Recursive call to find the next parent user, incrementing the depth
    return await this.get7thParentUserDetails(currentUser.parentUserId, depth + 1);
  }


  static async updateUserStatus(userId: any, status: any) {
    const user: any = await User.findOne({ where: userId });
    const referral = await Payment.findOne({ where: { userId: user.parentUserId } });
    const referee = await Payment.findOne({ where: { userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (referral) {
      referral.totalAmount += 100;
      await referral.save();
    }

    if (referee) {
      referee.status = 'live'
      await referee.save();
    }

    user.status = status;
    await user.save();
    return user;
  }

  static async updateUser(userId: any, data: any) {   
    return User.update(data, { where: { userId: userId } });
  }

  
  // Create a user with optional referral handling
  static async createUser(data: UserRegistrationData) {
    return await this.registerUserWithReferral(data);
  }

  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }
  
  
  private static async registerUserWithReferral(data: UserRegistrationData) {
    const { name, email, mobile, password, referralCode } = data;
    const hashedPassword = await hashPassword(password);
    let parentUserId: number | null = null;
    let otp = this.generateOTP(); // Generate OTP
    const emailVerified = false;  // Initial verification status
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    if (referralCode) {
      const referrer: any = await User.findOne({ where: { referralCode } });
      if (referrer) {
        parentUserId = referrer.userId;
      }
    }
  
    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      parentUserId,
      referralCode: await this.generateUniqueReferralCode(),
      otp,                 // Save OTP
      otpExpiry,
      emailVerified,       // Set verification status to false initially
    });
  
    await newUser.save();
  
    // Send OTP email
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      text: `Your OTP for email verification is: ${otp}`,
    });
  
    return newUser;
  }

  private static generateReferralCode(): string {
    const prefix = "REF";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomLetter2 = letters.charAt(Math.floor(Math.random() * letters.length));

    return `${prefix}${randomNum}${randomLetter1}${randomLetter2}`;
  }

  private static async generateUniqueReferralCode(): Promise<string> {
    let referralCode!: string;
    let isUnique = false;

    while (!isUnique) {
      referralCode = this.generateReferralCode();
      const existingUser = await User.findOne({ where: { referralCode } });
      isUnique = !existingUser;
    }

    return referralCode;
  }

  static async verifyEmailOtp(userId: number, otp: string): Promise<boolean> {
    const user:any = await User.findOne({ where: { userId } });
    if (!user) throw new Error('User not found');
  
    if (user.otp === otp) {
      user.emailVerified = true; // Update verification status
      user.otp = null;            // Clear OTP after successful verification
      await user.save();
      return true;
    }
    return false;
  }
  

  static async getReferralChain(userId: number): Promise<{ user: User; referrals: User[] }[]> {
    const referralChain: { user: User; referrals: User[] }[] = [];
    let currentUser: any = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname'],
    });

    while (currentUser) {
      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId },
        attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname'],
      });

      referralChain.push({ user: currentUser, referrals });

      currentUser = referrals.length > 0 ? referrals[0] : null;
    }

    return referralChain;
  }  

  static async getUserParentChain(userId: any): Promise<User[]> {
    const parents: User[] = [];
  
    let currentUser = await User.findByPk(userId);
    while (currentUser && currentUser.parentUserId) {
      parents.push(currentUser);
      currentUser = await User.findByPk(currentUser.parentUserId);
    }
  
    // Push the root user (who has no parent) if they exist
    if (currentUser) {
      parents.push(currentUser);
    }
  
    return parents;
  }
  

  static async getReferralChainList(userId: any): Promise<{ user: User | null; referrals: User[] }> {
    async function fetchChain(currentUser: User | null): Promise<{ user: User; referrals: User[] }> {
      if (!currentUser) {
        // Return a valid structure even when the user is null
        return { user: {} as User, referrals: [] }; // Return an empty User object as a placeholder
      }

      const referrals: User[] = await User.findAll({
        where: { parentUserId: currentUser.userId }
      });

      // Fetch referral chains for each referral and flatten the results
      const referralChains = await Promise.all(referrals.map(fetchChain));

      // Flatten the referral chains into a single array
      const allReferrals: User[] = referralChains.reduce((acc, chain) => {
        acc.push(chain.user); // Add the current user to the flat array
        return acc.concat(chain.referrals); // Concatenate the nested referrals
      }, [] as User[]);

      return { user: currentUser, referrals: allReferrals };
    }

    const initialUser: User | null = await User.findByPk(userId);
    return await fetchChain(initialUser);
  }

  static async getUserReferralChainList(userId: number): Promise<{ user: User; referrals: any[] }> {
    async function fetchChain(currentUser: User): Promise<{ user: User; referrals: any[] }> {
      if (!currentUser) null;

      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId },
        attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname'],
      });

      const referralChain = await Promise.all(referrals.map(async (referral) => await fetchChain(referral)));

      return { user: currentUser, referrals: referralChain };
    }

    const initialUser: any = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname'],
    });
    return await fetchChain(initialUser);
  }

  
  static async getTreeLengthFromChildUserId(userId: number): Promise<{ user: User | null; chain: User[] }> {
    async function fetchParentChain(currentUser: User | null, chain: User[] = []): Promise<User[]> {
      if (!currentUser) return chain;
  
      // Add current user to the chain
      chain.push(currentUser);
  
      // Find the parent user
      const parentUser = await User.findOne({
        where: { userId: currentUser.parentUserId },
        attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname', 'parentUserId'],
      });
  
      // Recurse upwards to find the full parent chain
      return fetchParentChain(parentUser, chain);
    }
  
    // Start with the initial user and fetch the chain upwards
    const initialUser = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname', 'parentUserId'],
    });
  
    // If initialUser is null, return an empty chain
    if (!initialUser) {
      return { user: null, chain: [] };
    }
  
    const chain = await fetchParentChain(initialUser);
    return { user: initialUser, chain };
  }
  

  static async getReferralChildrenTaskCompleted(userId: number): Promise<{
    user: User | null;
    referrals: any[],
    liveReferralCount: number // Total live referral count
  }> {

    // Helper function to recursively fetch the referral chain and count 'live' status referrals
    async function fetchChain(
      currentUser: User | null
    ): Promise<{
      user: User | null;
      referrals: any[],
      liveReferralCount: number // Track the count of 'live' referrals at this level
    }> {
      if (!currentUser) {
        return { user: null, referrals: [], liveReferralCount: 0 };
      }

      // Fetch immediate referrals for the current user
      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId },
        attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname'],
      });

      // Recursively fetch each referral's chain
      const referralChain = await Promise.all(referrals.map(async (referral) => await fetchChain(referral)));

      // Count only referrals with 'live' status at the current level
      const liveCountAtCurrentLevel = referrals.filter(referral => referral.status === 'live').length;

      // Sum up 'live' referral counts from all nested chains
      const liveReferralCount = liveCountAtCurrentLevel + referralChain.reduce((acc, referral) => acc + referral.liveReferralCount, 0);

      return {
        user: currentUser,
        referrals: referralChain,
        liveReferralCount // Return the count of 'live' status referrals
      };
    }

    // Fetch the initial user to start the chain
    const initialUser: User | null = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename', 'docpath', 'docname'],
    });

    if (!initialUser) throw new Error('User not found');

    // Call the recursive function to fetch chain and count 'live' status referrals
    return await fetchChain(initialUser);

  }

  static async deleteUser(id: number) {
    const coin = await User.findByPk(id);
    if (coin) {
      await coin.destroy();
      return { message: 'User deleted successfully' };
    }
    throw new Error('User not found');
  }

}


