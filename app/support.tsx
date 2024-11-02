import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, I18nManager } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Support = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const route = useRoute();
  const isArabic = route.params?.lang === "ar";

  // Check language and set RTL layout for Arabic
//   const isArabic = lang === 'ar';
  I18nManager.forceRTL(isArabic);

  const faq = isArabic ? [
    { 
      question: "كيف يمكنني التواصل مع صاحب العقار؟", 
      answer: "يمكنك التواصل مع صاحب العقار بعد النقر على زر الحجز في صفحة العقار، سنوفر لك رقم الواتساب لصاحب العقار."
    },
    { 
      question: "لماذا لا يظهر إعلاني؟", 
      answer: "بعد تقديم الإعلان يجب انتظار موافقتنا عليه حتى يتم نشره."
    },
    { 
      question: "كيف يمكنني إعادة تعيين كلمة المرور؟", 
      answer: "يمكنك إعادة تعيين كلمة المرور عن طريق النقر على زر نسيت كلمة المرور واتباع الخطوات الأمنية لتغييرها."
    },
    { 
      question: "كيف يمكنني حذف حسابي؟", 
      answer: "إذا كنت ترغب في حذف حسابك، يرجى التواصل معنا عبر البريد الإلكتروني ahmasshaher@gmail.com"
    }
  ] : [
    { 
      question: "How can I contact the property owner?", 
      answer: "You can contact the property owner by clicking the 'Booking' button on the property page. We’ll provide you with the owner's WhatsApp number."
    },
    { 
      question: "Why is my ad not showing?", 
      answer: "After submitting an ad, please wait for us to approve it before it becomes visible."
    },
    { 
      question: "How can I reset my password?", 
      answer: "You can reset your password by clicking 'Forgot Password' and following the security steps."
    },
    { 
      question: "How can I delete my account?", 
      answer: "If you want to delete your account, please contact us at our email ahmasshaher@gmail.com."
    }
  ];

  const toggleAnswer = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, isArabic && styles.textAlignRight]}>
        {isArabic ? "خدمة العملاء" : "Customer Support"}
      </Text>
      <Text style={[styles.subtitle, isArabic && styles.textAlignRight]}>
        {isArabic ? "فريق الدعم متاح 24/7 للمساعدة" : "Our support team is available 24/7 to assist you"}
      </Text>
      
      {faq.map((item, index) => (
        <View key={index} style={styles.faqContainer}>
          <TouchableOpacity onPress={() => toggleAnswer(index)} style={styles.questionContainer}>
            <Text style={[styles.questionText, isArabic && styles.textAlignRight]}>{item.question}</Text>
          </TouchableOpacity>
          {expandedQuestion === index && (
            <View style={styles.answerContainer}>
              <Text style={[styles.answerText, isArabic && styles.textAlignRight]}>{item.answer}</Text>
            </View>
          )}
        </View>
      ))}

      <View style={styles.footerContainer}>
        <Text style={[styles.footerText, isArabic && styles.textAlignRight]}>
          {isArabic ? "لم تجد الإجابة التي تبحث عنها؟" : "Didn't find the answer you were looking for?"}
        </Text>
        <Text style={[styles.footerText, isArabic && styles.textAlignRight]}>
          {isArabic ? "اتصل بنا عبر البريد الإلكتروني " : "Contact us at "}
          <Pressable onPress={() => {}}>
            <Text style={styles.contactEmail}>ahmasshaher@gmail.com</Text>
          </Pressable>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
    textAlign: 'center',
    fontFamily: "droidAr",
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: "droidAr",
  },
  textAlignRight: {
    textAlign: 'right',
  },
  faqContainer: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    fontFamily: "droidAr",
  },
  answerContainer: {
    padding: 15,
    backgroundColor: '#fdfdfd',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  answerText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    fontFamily: "droidAr",
  },
  footerContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: "droidAr",
  },
  contactEmail: {
    fontWeight: '600',
    color: '#4a90e2',
    fontFamily: "droidAr",
  },
});

export default Support;
