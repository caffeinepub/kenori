import Time "mo:core/Time";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";



actor {
  // Add storage subsystem for external file uploads
  include MixinStorage();

  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  module JournalEntry {
    public func compareByTimestamp(entry1 : JournalEntry, entry2 : JournalEntry) : Order.Order {
      Int.compare(entry2.timestamp, entry1.timestamp);
    };
  };

  let allUserData = Map.empty<Principal, AllUserData>();

  func getCallerData(caller : Principal) : AllUserData {
    switch (allUserData.get(caller)) {
      case (null) { Runtime.trap("User data not found") };
      case (?userData) { userData };
    };
  };

  func saveCallerData(caller : Principal, data : AllUserData) {
    allUserData.add(caller, data);
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
        {
          journal = [];
          tasks = [];
          moodLog = [];
          profile;
        };
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
    let updatedJournal = userData.journal.concat([entry]);
    let updatedData = {
      journal = updatedJournal;
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
    let updatedJournal = userData.journal.filter(func(e : JournalEntry) : Bool {
      e.timestamp != timestamp
    });
    let updatedData = {
      journal = updatedJournal;
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
    let updatedJournal = userData.journal.map(func(e : JournalEntry) : JournalEntry {
      if (e.timestamp == originalTimestamp) { updated } else { e }
    });
    let updatedData = {
      journal = updatedJournal;
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
    let updatedNotes = userData.tasks.concat([note]);
    let updatedData = {
      journal = userData.journal;
      tasks = updatedNotes;
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
    let updatedMoods = userData.moodLog.concat([mood]);
    let updatedData = {
      journal = userData.journal;
      tasks = userData.tasks;
      moodLog = updatedMoods;
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
        let sortedList = userData.journal.sort(JournalEntry.compareByTimestamp);
        sortedList;
      };
    };
  };

  public query ({ caller }) func getTaskList() : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };
    let data = getCallerData(caller);
    data.tasks;
  };

  public query ({ caller }) func getMoodLogByDay(timestamp : Time.Time) : async [DailyMood] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view mood logs");
    };
    let data = getCallerData(caller);
    data.moodLog.filter(func(m) { m.timestamp == timestamp });
  };
};
