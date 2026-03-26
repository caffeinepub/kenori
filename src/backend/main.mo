import Time "mo:core/Time";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Outcall "http-outcalls/outcall";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  stable var openaiApiKey : Text = "";

  public shared ({ caller }) func setOpenAIKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only admins can set the API key");
    };
    openaiApiKey := key;
  };

  public type Mood = {
    #happy;
    #sad;
    #neutral;
    #anxious;
    #excited;
  };

  public type JournalEntry = {
    title : Text;
    body : Text;
    mood : Mood;
    timestamp : Time.Time;
  };

  public type Note = {
    text : Text;
    completed : Bool;
  };

  public type UserProfile = {
    name : Text;
    themePreference : Text;
    bio : Text;
    avatarHairStyle : Text;
    avatarSkinTone : Text;
    avatarOutfitColor : Text;
    profilePhotoUrl : ?Text;
  };

  public type DailyMood = {
    mood : Mood;
    timestamp : Time.Time;
  };

  public type AllUserData = {
    journal : [JournalEntry];
    tasks : [Note];
    moodLog : [DailyMood];
    profile : UserProfile;
  };

  public type ChatMessage = {
    role : Text;
    content : Text;
    timestamp : Time.Time;
  };

  public type ChatMemoryEntry = {
    key : Text;
    value : Text;
    timestamp : Time.Time;
  };

  module JournalEntry {
    public func compareByTimestamp(e1 : JournalEntry, e2 : JournalEntry) : Order.Order {
      Int.compare(e2.timestamp, e1.timestamp);
    };
  };

  module ChatMessage {
    public func compareByTimestamp(a : ChatMessage, b : ChatMessage) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let allUserData = Map.empty<Principal, AllUserData>();
  let chatHistoryStore = Map.empty<Principal, [ChatMessage]>();
  let chatMemoryStore = Map.empty<Principal, [ChatMemoryEntry]>();

  func getCallerData(caller : Principal) : AllUserData {
    switch (allUserData.get(caller)) {
      case (null) { Runtime.trap("User data not found") };
      case (?userData) { userData };
    };
  };

  func saveCallerData(caller : Principal, data : AllUserData) {
    allUserData.add(caller, data);
  };

  // Extract a JSON string value for a given key from a JSON response
  func extractJsonString(json : Text, key : Text) : Text {
    let searchKey = "\"" # key # "\":";
    let parts = json.split(#text(searchKey));
    switch (parts.next()) {
      case (null) { return "I'm here for you." };
      case (_) {};
    };
    switch (parts.next()) {
      case (null) { return "I'm here for you." };
      case (?afterKey) {
        var inValue = false;
        var result = "";
        var prevWasBackslash = false;
        var done = false;
        for (c in afterKey.chars()) {
          if (not done) {
            if (not inValue) {
              if (c == '\"') { inValue := true };
            } else {
              if (prevWasBackslash) {
                if (c == 'n') { result := result # "\n" }
                else if (c == 't') { result := result # "\t" }
                else if (c == '\"') { result := result # "\"" }
                else if (c == '\\') { result := result # "\\" }
                else { result := result # Text.fromChar(c) };
                prevWasBackslash := false;
              } else if (c == '\\') {
                prevWasBackslash := true;
              } else if (c == '\"') {
                done := true;
              } else {
                result := result # Text.fromChar(c);
              };
            };
          };
        };
        if (result == "") { "I'm here for you." } else { result }
      };
    };
  };

  // Encode a text value as a JSON string (with quotes)
  func jsonString(t : Text) : Text {
    var result = "\"";
    for (c in t.chars()) {
      if (c == '\"') { result := result # "\\\"" }
      else if (c == '\\') { result := result # "\\\\" }
      else if (c == '\n') { result := result # "\\n" }
      else if (c == '\t') { result := result # "\\t" }
      else { result := result # Text.fromChar(c) };
    };
    result := result # "\"";
    result
  };

  func buildOpenAIPayload(userName : Text, memoryContext : Text, history : [ChatMessage], userMessage : Text) : Text {
    var messages = "[";

    let memPart = if (memoryContext != "") {
      "Things you remember about them: " # memoryContext # ". "
    } else { "" };

    let systemPrompt = "You are KENORI, a gentle and warm journaling companion. " #
      "Be a calm, safe space for the user to share thoughts and feelings. " #
      "Keep all responses SHORT (1-3 sentences), warm, personal, and supportive. " #
      "Never be robotic or give long explanations. " #
      "The user's name is " # userName # ". " #
      memPart #
      "Gently reference past feelings only when naturally relevant. " #
      "Use a calm, cozy tone.";

    messages := messages # "{\"role\":\"system\",\"content\":" # jsonString(systemPrompt) # "}";

    let recentHistory = if (history.size() > 10) {
      Array.tabulate(10, func(i) { history[history.size() - 10 + i] })
    } else {
      history
    };

    for (msg in recentHistory.vals()) {
      messages := messages # ",{\"role\":" # jsonString(msg.role) # ",\"content\":" # jsonString(msg.content) # "}";
    };

    messages := messages # ",{\"role\":\"user\",\"content\":" # jsonString(userMessage) # "}";
    messages := messages # "]";

    "{\"model\":\"gpt-4o-mini\",\"messages\":" # messages # ",\"max_tokens\":150,\"temperature\":0.8}";
  };

  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (allUserData.get(caller)) {
      case (null) { null };
      case (?userData) { ?userData.profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (allUserData.get(user)) {
      case (null) { null };
      case (?userData) { ?userData.profile };
    };
  };

  public query ({ caller }) func getAllUserData() : async ?AllUserData {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access user data");
    };
    allUserData.get(caller);
  };

  public shared ({ caller }) func saveUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let userData = switch (allUserData.get(caller)) {
      case (null) {
        { journal = []; tasks = []; moodLog = []; profile };
      };
      case (?existingData) {
        {
          journal = existingData.journal;
          tasks = existingData.tasks;
          moodLog = existingData.moodLog;
          profile;
        };
      };
    };
    saveCallerData(caller, userData);
  };

  public shared ({ caller }) func addJournalEntry(entry : JournalEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create journal entries");
    };
    let userData = getCallerData(caller);
    let updatedData = {
      journal = userData.journal.concat([entry]);
      tasks = userData.tasks;
      moodLog = userData.moodLog;
      profile = userData.profile;
    };
    saveCallerData(caller, updatedData);
  };

  public shared ({ caller }) func deleteJournalEntry(timestamp : Time.Time) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete journal entries");
    };
    let userData = getCallerData(caller);
    let updatedData = {
      journal = userData.journal.filter(func(e : JournalEntry) : Bool {
        e.timestamp != timestamp
      });
      tasks = userData.tasks;
      moodLog = userData.moodLog;
      profile = userData.profile;
    };
    saveCallerData(caller, updatedData);
  };

  public shared ({ caller }) func editJournalEntry(originalTimestamp : Time.Time, updated : JournalEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can edit journal entries");
    };
    let userData = getCallerData(caller);
    let updatedData = {
      journal = userData.journal.map(func(e : JournalEntry) : JournalEntry {
        if (e.timestamp == originalTimestamp) { updated } else { e }
      });
      tasks = userData.tasks;
      moodLog = userData.moodLog;
      profile = userData.profile;
    };
    saveCallerData(caller, updatedData);
  };

  public shared ({ caller }) func replaceAllNotes(notes : [Note]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update notes");
    };
    let userData = getCallerData(caller);
    let updatedData = {
      journal = userData.journal;
      tasks = notes;
      moodLog = userData.moodLog;
      profile = userData.profile;
    };
    saveCallerData(caller, updatedData);
  };

  public shared ({ caller }) func addNote(note : Note) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create notes");
    };
    let userData = getCallerData(caller);
    let updatedData = {
      journal = userData.journal;
      tasks = userData.tasks.concat([note]);
      moodLog = userData.moodLog;
      profile = userData.profile;
    };
    saveCallerData(caller, updatedData);
  };

  public shared ({ caller }) func logDailyMood(mood : DailyMood) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can log mood");
    };
    let userData = getCallerData(caller);
    let updatedData = {
      journal = userData.journal;
      tasks = userData.tasks;
      moodLog = userData.moodLog.concat([mood]);
      profile = userData.profile;
    };
    saveCallerData(caller, updatedData);
  };

  public query ({ caller }) func getSortedJournalEntries() : async [JournalEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view journal entries");
    };
    switch (allUserData.get(caller)) {
      case (null) { Runtime.trap("User data not found") };
      case (?userData) {
        userData.journal.sort(JournalEntry.compareByTimestamp);
      };
    };
  };

  public query ({ caller }) func getTaskList() : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    getCallerData(caller).tasks;
  };

  public query ({ caller }) func getMoodLogByDay(timestamp : Time.Time) : async [DailyMood] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view mood logs");
    };
    getCallerData(caller).moodLog.filter(func(m) { m.timestamp == timestamp });
  };

  public query ({ caller }) func getChatHistory() : async [ChatMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (chatHistoryStore.get(caller)) {
      case (null) { [] };
      case (?msgs) { msgs.sort(ChatMessage.compareByTimestamp) };
    };
  };

  public query ({ caller }) func getChatMemories() : async [ChatMemoryEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (chatMemoryStore.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  public shared ({ caller }) func saveChatMemories(entries : [ChatMemoryEntry]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    chatMemoryStore.add(caller, entries);
  };

  public shared ({ caller }) func sendChatMessage(
    userMessage : Text,
    memoryContext : Text,
    userName : Text,
  ) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };

    let now = Time.now();

    let existingHistory = switch (chatHistoryStore.get(caller)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };

    let userMsg : ChatMessage = {
      role = "user";
      content = userMessage;
      timestamp = now;
    };
    let historyWithUser = existingHistory.concat([userMsg]);
    chatHistoryStore.add(caller, historyWithUser);

    if (openaiApiKey == "") {
      let fallback = "I'm here with you. (To enable AI responses, set the OpenAI API key via setOpenAIKey.)";
      let assistantMsg : ChatMessage = {
        role = "assistant";
        content = fallback;
        timestamp = now + 1;
      };
      chatHistoryStore.add(caller, historyWithUser.concat([assistantMsg]));
      return fallback;
    };

    let payload = buildOpenAIPayload(userName, memoryContext, existingHistory, userMessage);

    let responseJson = await Outcall.httpPostRequest(
      "https://api.openai.com/v1/chat/completions",
      [
        { name = "Content-Type"; value = "application/json" },
        { name = "Authorization"; value = "Bearer " # openaiApiKey },
      ],
      payload,
      transform,
    );

    let aiReply = extractJsonString(responseJson, "content");

    let assistantMsg : ChatMessage = {
      role = "assistant";
      content = aiReply;
      timestamp = now + 1;
    };
    chatHistoryStore.add(caller, historyWithUser.concat([assistantMsg]));

    aiReply;
  };
};
