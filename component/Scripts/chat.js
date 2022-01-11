var convo = {
  ice: {
    says: [
      'Hello!',
      "Let's Start Play Rock Paper Scissor game With<em> me</em>.",
      '<img src= https://cdn.discordapp.com/attachments/926055068271251467/926055266561163274/bot-hi.gif />',
    ],

    reply: [
      {
        question: 'No, thanks.',
        answer: 'end',
      },
      {
        question: 'Wanna Play!',
        answer: 'play',
      },
    ],
  },

  // If Play click then this gonna be happen
  play: {
    says: [
      '<img src=https://cdn.discordapp.com/attachments/926055068271251467/930426835941093396/321-count-down.gif />',
    ],
    reply: [
      {
        question: 'Rock 🧱',
        answer: 'rock',
      },
      {
        question: 'Scissor ✂️',
        answer: 'scissor',
      },
      {
        question: 'Paper 🧾',
        answer: 'paper',
      },
    ],
  },
  //Rock
  rock: {
    says: [
      'You Won!!🎉',
      '<img src=https://cdn.discordapp.com/attachments/926055068271251467/930428415293685760/wongame.gif />',
    ],
    reply: [
      {
        question: 'Once More',
        answer: 'next',
      },
      {
        question: 'No, thanks.',
        answer: 'end',
      },
    ],
  },

  //Scissor
  scissor: {
    says: [
      'You Won!!🎉',
      '<img src=https://cdn.discordapp.com/attachments/926055068271251467/930428415293685760/wongame.gif />',
    ],
    reply: [
      {
        question: 'Once More',
        answer: 'next',
      },
      {
        question: 'No, thanks.',
        answer: 'end',
      },
    ],
  },

  //Paper
  paper: {
    says: [
      'You Lose😢 ',
      '<img src=https://cdn.discordapp.com/attachments/926055068271251467/930428415876685904/overgame.gif />',
    ],
    reply: [
      {
        question: 'Once More',
        answer: 'next',
      },
      {
        question: 'No, thanks.',
        answer: 'end',
      },
    ],
  },
  //next
  next: {
    says: [
      'Choose One !!',
      '<img src=https://cdn.discordapp.com/attachments/926055068271251467/930426835941093396/321-count-down.gif />',
    ],
    reply: [
      {
        question: 'Rock🧱',
        answer: 'rock',
      },
      {
        question: 'Scissor✂️',
        answer: 'scissor',
      },
      {
        question: 'Paper🧾',
        answer: 'paper',
      },
      {
        question: 'ME😁',
        answer: 'intro-context',
      },
    ],
  },

  // Intro of my Bot
  'intro-context': {
    says: [
      'I am a Game bot created by Buddhadeb Chhetri.',
      '<img src=https://cdn.discordapp.com/attachments/926055068271251467/926055264568893510/bot-info.gif />',
    ],
    reply: [
      {
        question: 'Start🏍',
        answer: 'chapter-one',
      },
    ],
  },

  // main conversation
  'chapter-one': {
    says: [
      'Excellent!',
      '(This is the main topic of our chat.)',
      'Now, Choose One?',
    ],
    reply: [
      {
        question: 'Rock🧱',
        answer: 'rock',
      },
      {
        question: 'Paper🧾',
        answer: 'paper',
      },
      {
        question: 'Scissor✂️',
        answer: 'scissor',
      },
    ],
  },

  // Ending the chat
  end: {
    says: [
      'Thanks for your time and attention.',
      '<img src=https://cdn.discordapp.com/attachments/926055068271251467/930428415876685904/overgame.gif>',
      'The chat is over, but you can <strong>start over</strong> to see how this conversation could have gone differently.',
    ],
    reply: [
      {
        question: 'Start over 😁',
        answer: 'ice',
      },
    ],
  },
}

var chatWindow = new Bubbles(document.getElementById('chat'), 'chatWindow')

chatWindow.talk(convo)
