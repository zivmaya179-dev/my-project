# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

This repository is currently a blank slate. It contains only a placeholder `README.md` (`# my-project`) and no source code, build configuration, dependency manifests, tests, or tooling.

There is therefore nothing yet to document in terms of:
- Build, lint, or test commands
- Language, framework, or runtime choices
- Code architecture or module layout
- Project-specific conventions

## Guidance for future sessions

- Before assuming any stack or workflow, re-check the working tree. The first real change to this repo (adding a `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, etc.) will define its direction.
- When the project gains real structure (source layout, build/test commands, architectural patterns, or contributor conventions), update this file to replace the "blank slate" notice with concrete guidance. Keep it focused on the non-obvious "big picture" that requires reading multiple files to understand.
- Development happens on feature branches per the harness instructions; do not push directly to `main`.
