// frontend/screens/PeerGroupsScreen.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, FlatList } from 'react-native';
import { Button, Card } from 'react-native-ui-lib';
import { supabase } from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';

export default function PeerGroupsScreen() {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [userTier, setUserTier] = useState('free');
  const navigation = useNavigation();

  useEffect(() => {
    loadGroups();
    loadUserGroups();
    checkUserTier();
  }, []);

  async function loadGroups() {
    const { data } = await supabase
      .from('peer_groups')
      .select('*');
    
    setGroups(data || []);
  }

  async function loadUserGroups() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);
    
    if (data) {
      setUserGroups(data.map(item => item.group_id));
    }
  }

  async function checkUserTier() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single();
    
    setUserTier(data?.tier || 'free');
  }

  async function createGroup() {
    if (!newGroupName) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('peer_groups')
      .insert([
        { 
          name: newGroupName, 
          description: newGroupDesc,
          created_by: user.id
        }
      ]);

    if (!error) {
      setNewGroupName('');
      setNewGroupDesc('');
      loadGroups(); // Reload groups
    }
  }

  async function joinGroup(groupId, isPremium) {
    if (isPremium && userTier === 'free') {
      alert('Upgrade to premium to join premium groups!');
      navigation.navigate('Upgrade');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: user.id }]);

    if (!error) {
      loadUserGroups(); // Reload user's groups
      alert('Joined group successfully!');
    }
  }

  function openGroupChat(group) {
    if (group.is_premium && userTier === 'free') {
      alert('Upgrade to premium to access premium group chats!');
      navigation.navigate('Upgrade');
      return;
    }

    if (!userGroups.includes(group.id)) {
      alert('You need to join the group first!');
      return;
    }

    navigation.navigate('GroupChat', { group });
  }

  const isMember = (groupId) => userGroups.includes(groupId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Peer Support Groups</Text>

      {/* Create Group Form */}
      <Card style={styles.formCard}>
        <Text style={styles.formTitle}>Create New Group</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={newGroupName}
          onChangeText={setNewGroupName}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Group Description"
          value={newGroupDesc}
          onChangeText={setNewGroupDesc}
          multiline
        />
        
        <Button
          label="Create Group"
          onPress={createGroup}
          style={styles.createButton}
        />
      </Card>

      {/* Groups List */}
      <Text style={styles.sectionTitle}>Available Groups</Text>
      {groups.length === 0 ? (
        <Text style={styles.emptyText}>No groups available yet. Create the first one!</Text>
      ) : (
        groups.map((group) => (
          <Card key={group.id} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{group.name}</Text>
              {group.is_premium && <Text style={styles.premiumBadge}>PREMIUM</Text>}
            </View>
            
            <Text style={styles.groupDescription}>{group.description}</Text>
            
            <View style={styles.groupActions}>
              {isMember(group.id) ? (
                <Button
                  label="Open Chat"
                  onPress={() => openGroupChat(group)}
                  style={styles.chatButton}
                />
              ) : (
                <Button
                  label="Join Group"
                  onPress={() => joinGroup(group.id, group.is_premium)}
                  style={styles.joinButton}
                />
              )}
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formCard: {
    padding: 15,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  groupCard: {
    padding: 15,
    marginBottom: 15,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: '#f39c12',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  groupDescription: {
    color: '#666',
    marginBottom: 15,
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  joinButton: {
    paddingHorizontal: 20,
  },
  chatButton: {
    paddingHorizontal: 20,
    backgroundColor: '#2ecc71',
  },
});