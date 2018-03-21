**Whisper App**

By Jacky Chen

**Getting Started**

To clone repository via ssh
1. Generate rsa private/public key pair with `ssh-keygen -t rsa`
2. Print the public key in the terminal with `cat ~/.ssh/id_rsa.pub`
3. Copy and paste entire output
4. In gitlab, click to: Profile Pic -> settings -> SSH Keys
5. Paste in Key box and press "Add Key"
6. Go to your local directory and `git clone git@gitlab.com:whisperApp/whisper-iOS.git`

To run the simulation. You'll need:

- Xcode (OSX)
- Node and NPM

**Instructions**

1. `cd` into the actual directory with package.json
2. Type `npm install` to install all of the npm packages in package.json
3. Start local json database server
    * `json-server -p 8080 --watch db.json`
4. Start the simulation
    * `react-native run-ios`

**Files**
**Front End**
* `/Components/`
* `/Assets/style.js`

**Back End**
* `/Components/`
* `/src/`