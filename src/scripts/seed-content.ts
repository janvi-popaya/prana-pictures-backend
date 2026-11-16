import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import { Film } from "../models/film.model.js";
import { InformationPage } from "../models/information.model.js";
import { News } from "../models/news.model.js";
import { TeamMember } from "../models/team.model.js";

const films = [
  {
    title: "Choices",
    slug: "choices",
    descriptionHtml:
      "<p>A staunch pro-life advocate and a steadfast pro-choice activist confront life and relationships anew when challenged by the choices they have made.</p>",
    shortDescription: "Every choice leaves a mark.",
    genres: ["Short", "Drama"],
    cast: "Jackie Dallas, Puneet, Sherill Quinn",
    directedBy: "Amir Jaffer",
    writtenBy: "Puneet",
    musicBy: "Aalap Desai",
    producedBy: "Ajit Mukundan",
    imdbUrl: "https://www.imdb.com/title/tt10729444/",
    letterboxdUrl: "https://letterboxd.com/imdb/tt10729444/",
    language: "English",
    releaseDate: new Date("2020-04-01T00:00:00.000Z"),
    runtimeMinutes: 20,
    trailerUrl: "https://vimeo.com/383426988",
    sortOrder: 98,
    status: "enabled",
    seo: {
      metaTitle: "Choices",
      metaDescription: "Learn about Choices by Prana Pictures.",
      metaKeywords: ["Choices", "Prana Pictures", "short film"],
    },
  },
  {
    title: "Chances",
    slug: "chances",
    descriptionHtml:
      "<p>A middle-aged professor faces circumstances that challenge his ideas about the norms of love and life.</p>",
    shortDescription: "Love will always find a way.",
    genres: ["Short", "Drama"],
    cast: "Puneet, Nadia Nazir, Marvina Reasons",
    directedBy: "Amir Jaffer",
    writtenBy: "Joyce Lee Kinney",
    musicBy: "Aalap Desai",
    producedBy: "Ajit Mukundan, Amir Jaffer",
    imdbUrl: "https://www.imdb.com/title/tt7642934/",
    letterboxdUrl: "https://letterboxd.com/imdb/tt7642934/",
    language: "English",
    releaseDate: new Date("2018-05-18T00:00:00.000Z"),
    runtimeMinutes: 17,
    trailerUrl: "https://vimeo.com/341265115",
    sortOrder: 100,
    status: "enabled",
    seo: {
      metaTitle: "Chances",
      metaDescription: "Learn about Chances by Prana Pictures.",
      metaKeywords: ["Chances", "Prana Pictures", "short film"],
    },
  },
  {
    title: "Hiraeth",
    slug: "hiraeth",
    descriptionHtml:
      "<p>Hiraeth weaves together the experiences of immigrants living in the United States as they navigate love, pain, discrimination, racism and belonging.</p>",
    shortDescription: "Where do we belong?",
    genres: ["Series", "Drama"],
    cast:
      "Puneet, Isaac Benjamin, Sherill Quinn, Maaz Ali, David Massil, Rebecca Faiola, Nikki Chawla",
    directedBy: "Amir Jaffer",
    writtenBy:
      "Amir Jaffer, MK Ansari, Barry Gottlieb",
    musicBy: "Aalap Desai",
    producedBy: "Cinema 3.0",
    imdbUrl: "https://www.imdb.com/title/tt10449320/",
    letterboxdUrl: "https://letterboxd.com/imdb/tt10449320/",
    language: "English",
    releaseDate: new Date("2020-01-01T00:00:00.000Z"),
    runtimeMinutes: 21,
    trailerUrl: "https://vimeo.com/457969452",
    sortOrder: 96,
    status: "enabled",
    seo: {
      metaTitle: "Hiraeth",
      metaDescription: "Learn about Hiraeth by Prana Pictures.",
      metaKeywords: ["Hiraeth", "Prana Pictures", "series"],
    },
  },
  {
    title: "Not Tonight",
    slug: "not-tonight",
    descriptionHtml:
      "<p>Tech titan Amar and his wife, Amy, return late one night from a party. The evening spirals into chaos after Amar persuades their old friend Mike to come over.</p>",
    shortDescription: "One night changes everything.",
    genres: ["Feature", "Drama"],
    cast: "Puneet, Allison Ewing, Tyler McKenna, Vikki Beretta",
    directedBy: "Amir Jaffer",
    writtenBy: "Puneet",
    musicBy: "David Obaniyi",
    producedBy: "Wolfgang Boeck, Ajit Mukundan",
    imdbUrl: "https://www.imdb.com/title/tt31107292/",
    letterboxdUrl: "https://letterboxd.com/imdb/tt31107292/",
    language: "English",
    releaseDate: new Date("2024-01-01T00:00:00.000Z"),
    runtimeMinutes: 74,
    trailerUrl: "https://www.youtube.com/watch?v=lzDrl6yZf3o",
    sortOrder: 95,
    status: "enabled",
    seo: {
      metaTitle: "Not Tonight",
      metaDescription: "Learn about Not Tonight by Prana Pictures.",
      metaKeywords: ["Not Tonight", "Prana Pictures", "feature film"],
    },
  },
] as const;

const newsItems = [
  ["BOBBY wins Best Short at DCSAFF!", "BOBBY was named Best Short Film in the Audience Poll category at the DC South Asian Film Festival."],
  ["Bobby ends 2021 on a high note", "A year of screenings brought Bobby to new audiences and conversations."],
  ["Bobby wins hearts in Kolkata", "A story about family and understanding meets audiences in Kolkata."],
  ["Puneet wins Best Screenplay", "A recognition of the writing behind a deeply human story."],
  ["10th MSIFF features Bobby", "Bobby joins a festival program celebrating independent cinema."],
  ["VISAFF 21 selects Bobby", "A festival selection brings Bobby to another audience."],
  ["Inside the making of Bobby", "A closer look at the people and moments behind the film."],
  ["A Kolkata audience finds its story", "A screening opens space for connection, reflection and conversation."],
  ["Celebrating independent storytellers", "Recognizing the artists who bring distinctive stories to the screen."],
] as const;

async function seed() {
  await connectDB();

  for (const film of films) {
    await Film.findOneAndUpdate(
      { slug: film.slug },
      { $set: film },
      { upsert: true, returnDocument: "after", runValidators: true },
    );
  }

  await TeamMember.findOneAndUpdate(
    { name: "Ajit Mukundan" },
    {
      $set: {
        name: "Ajit Mukundan",
        designation: "Managing Partner",
        shortBio:
          "A successful businessman passionate about the arts and focused on connecting stories with their intended audiences.",
        descriptionHtml:
          "<p>Ajit Mukundan is passionate about the arts and believes effective storytelling can open new worlds for audiences.</p>",
        sortOrder: 1,
        status: "enabled",
        socialLinks: [
          {
            platform: "facebook",
            url: "https://www.facebook.com/ajit.mukundan.3",
            sortOrder: 1,
          },
        ],
      },
    },
    { upsert: true, returnDocument: "after", runValidators: true },
  );

  await InformationPage.findOneAndUpdate(
    { title: { $regex: /^Vision$/i } },
    {
      $set: {
        slug: "vision",
        descriptionHtml:
          "<p>Empowering independent filmmakers to bring bold stories to life for South Asian and global audiences.</p>",
        icon: "info",
        showInFooter: false,
        sortOrder: 2,
        status: "enabled",
        seo: {
          metaTitle: "Our Vision",
          metaDescription: "The vision of Prana Pictures.",
          metaKeywords: ["Prana Pictures", "vision"],
        },
      },
      $setOnInsert: {
        title: "Vision",
      },
    },
    { upsert: true, returnDocument: "after", runValidators: true },
  );

  for (const [index, [title, description]] of newsItems.entries()) {
    await News.findOneAndUpdate(
      { title },
      {
        $set: {
          title,
          description,
          sortOrder: index + 1,
          status: "enabled",
        },
      },
      { upsert: true, returnDocument: "after", runValidators: true },
    );
  }

  const [filmCount, teamCount, newsCount] = await Promise.all([
    Film.countDocuments({ status: "enabled" }),
    TeamMember.countDocuments({ status: "enabled" }),
    News.countDocuments({ status: "enabled" }),
  ]);

  console.log("Content seed completed successfully");
  console.log(`Enabled films: ${filmCount}`);
  console.log(`Enabled team members: ${teamCount}`);
  console.log(`Enabled news items: ${newsCount}`);
}

seed()
  .catch((error) => {
    console.error("Content seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
