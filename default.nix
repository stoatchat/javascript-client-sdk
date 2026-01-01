{
  pkgs ? import <nixpkgs> { },
}:

with pkgs;
pkgs.mkShell {
  name = "stoatEnv";

  buildInputs = [
    # Tools
    git
    gh
    deno

    # Node
    nodejs
    nodejs.pkgs.pnpm
  ];
}
