import React, { useState } from "react";
import { Container, Navbar, Nav, Card } from "react-bootstrap";
import { version } from "./../../../package.json";
import { IDatabaseMode } from "../components/DatabaseDetail";
import logo from "../logo.svg";
import FireDashboard from "./FireDashboard";

export function Home() {
  return (
    <>
      <header>
        <Navbar
          bg="dark"
          variant="dark"
          className="justify-content-between"
          fixed="top"
        >
          <div>
            <Navbar.Brand href="#home">
              <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt=""
              />
            </Navbar.Brand>
            <Navbar.Brand href="#home">Electron-React</Navbar.Brand>
          </div>
          <div>
            <Nav className="pr-5">
              <Nav.Link active>SqLite</Nav.Link>
            </Nav>
          </div>
        </Navbar>
      </header>
      <main>
        <Container>
          <Card className="p-3 mb-5 text-center text-light bg-dark">
            <h1> SQLite - Firestore Sync</h1>
          </Card>
          <FireDashboard />
        </Container>
      </main>
      <footer>
        <Navbar
          fixed="bottom"
          className="bg-dark justify-content-between footer px-3 py-1 "
        >
          <span className="text-muted font-weight-lighter ">
            Copyright © {new Date().getFullYear()} Vazra. MIT License.
          </span>
          <span className="text-muted float-right font-weight-lighter">
            v{version}
          </span>
        </Navbar>
      </footer>
    </>
  );
}

export default Home;
