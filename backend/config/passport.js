const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

// 1. Local Email/Password Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password.' });
        }
        
        // OAuth users might not have a password
        if (!user.password) {
          return done(null, false, { message: 'This account uses Google or GitHub login. Please log in using that method.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 2. Google OAuth Strategy (Configured only if credentials exist)
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret && googleClientSecret !== 'placeholder_secret_replace_me') {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: '/api/auth/google/callback',
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (!email) {
            return done(new Error('Google account must have a public email address.'));
          }

          // 1. Check if user already linked to Google
          let user = await userModel.findByProvider('google', profile.id);
          if (user) {
            return done(null, user);
          }

          // 2. Check if user exists with the same email
          user = await userModel.findByEmail(email);
          const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
          
          if (user) {
            // Link account
            user = await userModel.linkProvider(user.id, 'google', profile.id, avatarUrl);
            return done(null, user);
          }

          // 3. Register user
          const name = profile.displayName || profile.name.givenName || 'Google User';
          user = await userModel.createUser({
            name,
            email,
            provider: 'google',
            provider_id: profile.id,
            avatar_url: avatarUrl
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  console.log('✅ Google OAuth strategy enabled.');
} else {
  console.warn('⚠️ Google OAuth credentials not set. Google sign-in is disabled.');
}

// 3. GitHub OAuth Strategy (Configured only if credentials exist)
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (githubClientId && githubClientSecret && githubClientSecret !== 'placeholder_secret_replace_me') {
  const GitHubStrategy = require('passport-github2').Strategy;
  passport.use(
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email'] // Request email access
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (!email) {
            return done(new Error('GitHub account must have a public email. Add it in your profile settings.'));
          }

          // 1. Check if user already linked to GitHub
          let user = await userModel.findByProvider('github', profile.id);
          if (user) {
            return done(null, user);
          }

          // 2. Check if user exists with the same email
          user = await userModel.findByEmail(email);
          const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

          if (user) {
            // Link account
            user = await userModel.linkProvider(user.id, 'github', profile.id, avatarUrl);
            return done(null, user);
          }

          // 3. Register user
          const name = profile.displayName || profile.username || 'GitHub User';
          user = await userModel.createUser({
            name,
            email,
            provider: 'github',
            provider_id: profile.id,
            avatar_url: avatarUrl
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  console.log('✅ GitHub OAuth strategy enabled.');
} else {
  console.warn('⚠️ GitHub OAuth credentials not set. GitHub sign-in is disabled.');
}

// Serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
