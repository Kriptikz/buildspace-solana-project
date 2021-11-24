const anchor = require('@project-serum/anchor');

// Need the system program 
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  // * I'm curious why we created the provider variable, maybe we will update it in the future, or we may need to read it.
  // * Looks like its used when creating the tx so we don't have to type anchor.Provider.env() every time.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Now our start_stuff_off function requires params for the context.
  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Gif Count', account.totalGifs.toString())

  // Call add_gif
  await program.rpc.addGif("insert_a_giphy_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  // Fetch data from the account to see what changed
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log('Gif Count', account.totalGifs.toString())
  console.log('Gif List', account.gifList)

}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();